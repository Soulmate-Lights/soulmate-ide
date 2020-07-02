require("v8-compile-cache");

const electron = require("electron");
const { app, BrowserWindow, ipcMain, systemPreferences } = electron;
const path = require("path");
const isDev = require("electron-is-dev");
const bonjour = require("bonjour")();
const { autoUpdater } = require("electron-updater");

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
    titleBarStyle: "hiddenInset",
    backgroundColor: systemPreferences.isDarkMode() ? "#333" : "#fff",
    webPreferences: {
      enableRemoteModule: true,
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
}

app.on("ready", createWindow);

if (process.platform !== "darwin") app.on("window-all-closed", app.quit);

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
