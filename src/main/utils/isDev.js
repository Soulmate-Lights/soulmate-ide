let isDev = false;
if (window.location.host === "localhost:3000") {
  isDev = true;
} else {
  isDev = electron?.require("remote").require("electron-is-dev");
}
export default isDev;
