const electron = require("electron");
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

const bonjour = require('bonjour')();
const { ipcMain } = require('electron')

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    icon: __dirname + '/AppIcon.icns'
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: __dirname + '/preload.js'
    }
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  // mainWindow.webContents.openDevTools()

  mainWindow.on("closed", () => (mainWindow = null));
  ipcMain.on('scan', () => {
    // browse for all http services
    bonjour.find({ type: 'http' }, function (service) {
      const lowerCaseHost = service.host.toLowerCase();
      if (lowerCaseHost.indexOf('soulmate') > -1) {
        mainWindow.webContents.send('soulmate', service)
      }
    })
  })
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
