const electron = require("electron");
const { app, BrowserWindow, ipcMain, systemPreferences } = electron;
const path = require("path");
const isDev = require("electron-is-dev");
const bonjour = require("bonjour")();
const { autoUpdater } = require("electron-updater");
const SentryElectron = require("@sentry/electron");
const keytar = require("keytar");

const options = {
  release: require("../package.json").version,
  dsn:
    "https://d71092cee93f41a1a5c02404ad236f82@o141622.ingest.sentry.io/5433159",
  environment: isDev ? "development" : "production",
};

SentryElectron.init(options);

app.on("ready", () => {
  if (isDev) {
    // autoUpdater.updateConfigPath = path.join(__dirname, "dev-app-update.yml");
    const log = require("electron-log");
    log.transports.file.level = "debug";
    autoUpdater.logger = log;
  }

  autoUpdater.checkForUpdatesAndNotify();
  app.setAsDefaultProtocolClient("soulmate");
});

let mainWindow;

function createWindow() {
  app.userAgentFallback = app.userAgentFallback.replace(
    "Electron/" + process.versions.electron,
    ""
  );

  // This allows non-context-aware modules to be loaded in the renderer process.
  // This will not be an option in Electron 12, so we should probably look to remove
  // this whenever Electron is updated.
  // Used for the new nodeIntegration / require logic for app.asar changes.
  // https://github.com/electron/electron/issues/18397
  app.allowRendererProcessReuse = false;

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
      nodeIntegration: true,
      // webSecurity: false,
      preload: __dirname + "/preload.js",
    },
  });

  mainWindow.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
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
      if (service.host.toLowerCase().includes("soulmate")) {
        mainWindow.webContents.send("soulmate", service);
      }
    });
  });

  ipcMain.handle("get-password", async (event, user) => {
    return await keytar.getPassword("Soulmate IDE", user);
  });

  ipcMain.handle("set-password", async (event, user, pass) => {
    return await keytar.setPassword("Soulmate IDE", user, pass);
  });

  ipcMain.handle("delete-password", async (event, user) => {
    return await keytar.deletePassword("Soulmate IDE", user);
  });

  mainWindow.once("ready-to-show", mainWindow.show);
}

app.on("ready", createWindow);

if (process.platform !== "darwin") app.on("window-all-closed", app.quit);

app.on("activate", () => {
  if (mainWindow === null) createWindow();
});
