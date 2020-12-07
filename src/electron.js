const electron = require("electron");
const { session } = electron;
const { app, BrowserWindow, ipcMain, systemPreferences } = electron;
const path = require("path");
const isDev = require("electron-is-dev");
const bonjour = require("bonjour")();
const { autoUpdater } = require("electron-updater");
const SentryElectron = require("@sentry/electron");

const options = {
  release: require("../package.json").version,
  dsn:
    "https://d71092cee93f41a1a5c02404ad236f82@o141622.ingest.sentry.io/5433159",
  environment: process.env.NODE_ENV,
};

SentryElectron.init(options);

app.on("ready", () => {
  autoUpdater.checkForUpdatesAndNotify();
});

let mainWindow;

function createWindow() {
  app.userAgentFallback = app.userAgentFallback.replace(
    "Electron/" + process.versions.electron,
    ""
  );

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    show: false,
    titleBarStyle: "hidden",
    backgroundColor: systemPreferences.isDarkMode() ? "#333" : "#fff",
    webPreferences: {
      enableRemoteModule: true,
      // nodeIntegrationInWorker: true,
      // Removed these June 11th for security
      // nodeIntegration: true,
      // webSecurity: false,
      preload: __dirname + "/preload.js",
    },
  });

  const mainUrl = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "../build/index.html")}`;

  mainWindow.loadURL(mainUrl);
  mainWindow.webContents.on("did-fail-load", () => {
    mainWindow.loadURL(mainUrl);
  });

  if (isDev) mainWindow.webContents.openDevTools();

  mainWindow.on("focus", () => mainWindow.webContents.send("focus", true));
  mainWindow.on("blur", () => mainWindow.webContents.send("focus", false));
  mainWindow.on("closed", () => (mainWindow = null));

  ipcMain.on("scan", () => {
    bonjour.find({ type: "http" }, (service) => {
      if (service.host.toLowerCase().indexOf("soulmate") > -1) {
        mainWindow.webContents.send("soulmate", service);
      }
    });
  });

  mainWindow.once("ready-to-show", mainWindow.show);

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        "Content-Security-Policy": [
          `default-src 'self' 'unsafe-inline' ws://localhost:*/ www.googletagmanager.com www.google-analytics.com lh3.googleusercontent.com rsms.me editor.soulmatelights.com; script-src 'self' www.googletagmanager.com www.google-analytics.com devtools: 'unsafe-eval'; style-src 'self' 'unsafe-inline' rsms.me ; font-src *; img-src 'self' 'unsafe-inline' *.s3.amazonaws.com lh3.googleusercontent.com www.google-analytics.com`,
        ],
      },
    });
  });
}

// function openConsoleWindow() {
//   const consoleWindow = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     show: true,
//     webPreferences: {
//       enableRemoteModule: true,
//       // nodeIntegrationInWorker: true,
//       // Removed these June 11th for security
//       // nodeIntegration: true,
//       // webSecurity: false,
//       preload: __dirname + "/preload.js",
//     },
//   });

//   const consoleUrl = isDev
//     ? "http://localhost:3000/#console"
//     : `file://${path.join(__dirname, "../build/index.html#console")}`;
//   consoleWindow.loadURL(consoleUrl);

//   if (isDev) consoleWindow.webContents.openDevTools();

//   consoleWindow.once("ready-to-show", consoleWindow.show);
// }

app.on("ready", createWindow);
// app.on("ready", openConsoleWindow);

if (process.platform !== "darwin") app.on("window-all-closed", app.quit);

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
