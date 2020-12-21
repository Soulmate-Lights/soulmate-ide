let isDev = false;
if (typeof electron !== "undefined") {
  isDev = electron.remote.require("electron-is-dev");
} else if (window.location.host === "localhost:3000") {
  isDev = true;
}
export default isDev;
