let isDev = false;
if (typeof electron !== "undefined") {
  try {
    require("electron-is-dev");
  } catch (e) {
    // First time requiring this module fails on fs.existsSync
  }
  isDev = require("electron-is-dev");
} else if (window.location.host === "localhost:3000") {
  isDev = true;
} else if (window.location.host.includes(":300")) {
  isDev = true;
}
export default isDev;
