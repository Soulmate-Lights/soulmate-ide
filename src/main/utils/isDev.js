let isDev = false;
if (typeof electron !== "undefined") {
  // isDev = require('electron-is-dev');
  isDev = remote.require(
    `../app-${electron.remote.process.arch}.asar/node_modules/electron-is-dev`
  );
  // isDev = require("electron").remote.require("electron-is-dev");
} else if (window.location.host === "localhost:3000") {
  isDev = true;
} else if (window.location.host.includes(":300")) {
  isDev = true;
}
export default isDev;
