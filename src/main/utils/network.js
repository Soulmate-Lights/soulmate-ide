import normalizeUrl from "normalize-url";

import isDev from "~/utils/isDev";
import isElectron from "~/utils/isElectron";

import { auth0Promise } from "./auth";

// Special URLs used for login
let _host = process.env.SERVER || window.location.origin;
if (isElectron() && !process.env.SERVER)
  _host = "https://editor.soulmatelights.com";
export const host = _host;
export const clientSideUrl = (path) => {
  if (isDev && process.env.SERVER) return `http://localhost:3000${path}`;
  return normalizeUrl(host + "/" + path);
};

export const SKETCHES_PATH = "/sketches/list";
export const SKETCH_PATH = (id) => `/sketches/${id}`;
export const ALL_SKETCHES_PATH = "/sketches/all";
export const PLAYLISTS_PATH = "/my-playlists";

export const headersAndCredentials = async () => {
  const auth = await auth0Promise;
  const authenticated = await auth.isAuthenticated();
  const headers = { "Content-Type": "application/json" };
  if (authenticated) headers["Authorization"] = await auth.getTokenSilently();
  return {
    headers: headers,
    credentials: "include",
  };
};
