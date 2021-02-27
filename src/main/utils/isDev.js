// let isDev = require("electron-is-dev");
let isDev = false;

if (window.location.host === "localhost:3000") {
  isDev = true;
} else if (window.location.host.includes(":300")) {
  isDev = true;
}

export default isDev;
