// const devHost = "http://localhost:3001";
const productionHost = "https://editor.soulmatelights.com";
let host = productionHost;
// import isElectron from "~/utils/isElectron";
// if (isElectron()) {

//   host =
//     remote && remote?.require("electron-is-dev") ? devHost : productionHost;
// }

// Figure out a better way of doing these?
export const url = (path) => host + path;
export const SKETCHES_URL = url("/sketches/list");
export const ALL_SKETCHES_URL = url("/sketches/all");
export const PLAYLISTS_URL = url("/my-playlists");
