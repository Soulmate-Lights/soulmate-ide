import normalizeUrl from "normalize-url";

// const host = "http://192.168.4.76:3001";
// const host = "http://localhost:3001";
// const host = "http://macbook-pro.local:3001";
export const host = "https://editor.soulmatelights.com";

export const url = (path) => normalizeUrl(host + "/" + path);

export const SKETCHES_URL = "/sketches/list";
export const ALL_SKETCHES_URL = "/sketches/all";
export const PLAYLISTS_URL = "/my-playlists";
