const electron = require("electron");
const app = electron.app;

const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const isDev = require("electron-is-dev");

const bonjour = require("bonjour")();
const { ipcMain } = require("electron");

let mainWindow;

const { protocol } = require("electron");

// const mainUrl = isDev
//   ? "http://localhost:3000"
//   : `file://${path.join(__dirname, "../build/index.html")}`;

const mainUrl = `file://${path.join(__dirname, "../build/index.html")}`;

// app.whenReady().then(() => {
//   protocol.registerFileProtocol(
//     "soulmate",
//     (request, callback) => {
//       // const url = request.url.substr(7);
//       // console.log(request.url);
//       // // console.log(__dirname);
//       // console.log("=======================");
//       // callback({ path: path.normalize(`${__dirname}/${url}`) });
//       // if (isDev)
//       // callback({ path: __dirname });
//       const redirect = request.url.replace("soulmate://callback", mainUrl);

//       mainWindow.loadURL(redirect);
//     },
//     (error) => {
//       if (error) console.error("Failed to register protocol");
//     }
//   );
// });

function createWindow() {
  app.userAgentFallback = app.userAgentFallback.replace(
    "Electron/" + process.versions.electron,
    ""
  );

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 800,
    // icon: __dirname + "/icon.png",
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      preload: __dirname + "/preload.js",
    },
  });

  const {
    session: { webRequest },
  } = mainWindow.webContents;

  // const filter = {
  //   urls: ["soulmate://callback*"],
  // };

  // webRequest.onBeforeRequest(filter, async ({ url }) => {
  //   // await authService.loadTokens(url);
  //   // createAppWindow();
  //   // return destroyAuthWin();
  //   const code = request.url.replace("soulmate://callback", "");
  //   console.log(redirect);
  //   mainWindow.loadURL(mainUrl);
  // });

  mainWindow.loadURL(mainUrl);
  // mainWindow.webContents.openDevTools()

  mainWindow.on("closed", () => (mainWindow = null));
  ipcMain.on("scan", () => {
    // browse for all http services
    bonjour.find({ type: "http" }, function (service) {
      const lowerCaseHost = service.host.toLowerCase();
      if (lowerCaseHost.indexOf("soulmate") > -1) {
        mainWindow.webContents.send("soulmate", service);
      }
    });
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
