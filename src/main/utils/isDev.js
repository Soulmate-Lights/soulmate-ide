let isDev = false;
if (typeof electron !== "undefined") {
  // This gets set in preload.js
  isDev = window.isDev;
} else if (window.location.host === "localhost:3000") {
  isDev = true;
} else if (window.location.host.includes(":300")) {
  isDev = true;
}
export default isDev;
