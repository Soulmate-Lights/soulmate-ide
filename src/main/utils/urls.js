import normalizeUrl from "normalize-url";

const host = "http://localhost:3001";
// export const host = "https://editor.soulmatelights.com";

export const url = (path) => normalizeUrl(host + "/" + path);

export const SKETCHES_URL = url("/sketches/list");
export const ALL_SKETCHES_URL = url("/sketches/all");
export const PLAYLISTS_URL = url("/my-playlists");
