const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const bonjour = require("bonjour")();
const { ipcMain } = require("electron");
const { protocol } = require("electron");
const auth = require("./auth");

let mainWindow;

const mainUrl = isDev
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "../build/index.html")}`;

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
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      webSecurity: false,
      preload: __dirname + "/preload.js",
    },
  });

  const {
    session: { webRequest },
  } = mainWindow.webContents;

  mainWindow.loadURL(mainUrl);

  mainWindow.on("focus", () => {
    mainWindow.webContents.send("focus", true);
  });
  mainWindow.on("blur", () => {
    mainWindow.webContents.send("focus", false);
  });

  mainWindow.on("closed", () => (mainWindow = null));

  ipcMain.on("scan", () => {
    bonjour.find({ type: "http" }, function (service) {
      if (service.host.toLowerCase().indexOf("soulmate") > -1) {
        mainWindow.webContents.send("soulmate", service);
      }
    });
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
