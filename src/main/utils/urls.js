import normalizeUrl from "normalize-url";

export const host = process.env.SERVER || "https://editor.soulmatelights.com";

export const url = (path) => normalizeUrl(host + "/" + path);

export const SKETCHES_URL = "/sketches/list";
export const ALL_SKETCHES_URL = "/sketches/all";
export const PLAYLISTS_URL = "/my-playlists";
