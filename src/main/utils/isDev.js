let isDev = false;
if (window.location.host === "localhost:3000") {
  isDev = true;
} else if (typeof electron !== "undefined") {
  isDev = electron.remote.require("electron-is-dev");
}
export default isDev;
