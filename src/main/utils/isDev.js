export default () => {
  let isDev = false;
  if (typeof electron !== "undefined") {
    isDev = window['req'+'uire']("electron-is-dev");
  } else if (window.location.host === "localhost:3000") {
    isDev = true;
  } else if (window.location.host.includes(":300")) {
    isDev = true;
  }
  return isDev;
};
