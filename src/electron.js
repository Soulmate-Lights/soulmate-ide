const electron = require("electron");
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const isDev = require("electron-is-dev");
const bonjour = require("bonjour")();
const { ipcMain } = require("electron");
const { protocol } = require("electron");
const auth = require("./auth");
const { autoUpdater } = require("electron-updater");

// autoUpdater.logger.transports.file.level = "info";
autoUpdater.on("checking-for-update", () => {
  console.log("Checking for update...");
});
autoUpdater.on("update-available", (info) => {
  console.log("Update available.");
});
autoUpdater.on("update-not-available", (info) => {
  console.log("Update not available.");
});
autoUpdater.on("error", (err) => {
  console.log("Error in auto-updater. " + err);
});
autoUpdater.on("download-progress", (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + " - Downloaded " + progressObj.percent + "%";
  log_message += `(${progressObj.transferred} / ${progressObj.total})`;
  console.log(log_message);
});
autoUpdater.on("update-downloaded", (info) => {
  console.log("Update downloaded");
});
let template = [];
if (process.platform === "darwin") {
  // OS X
  const name = app.getName();
  template.unshift({
    label: name,
    submenu: [
      {
        label: "About " + name,
        role: "about",
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click() {
          app.quit();
        },
      },
    ],
  });
}

app.on("ready", function () {
  autoUpdater.checkForUpdatesAndNotify();
});

let mainWindow;

const mainUrl = isDev
  ? "http://localhost:3000"
  : `file://${path.join(__dirname, "../build/index.html")}`;

function createWindow() {
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

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
