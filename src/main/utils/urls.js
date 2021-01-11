import normalizeUrl from "normalize-url";

import isDev from "~/utils/isDev";

export const host = process.env.SERVER || "https://editor.soulmatelights.com";

export const url = (path) => normalizeUrl(host + "/" + path);

// Special URLs used for login
export const clientSideUrl = (path) => {
  if (isDev && process.env.SERVER) return `http://localhost:3000${path}`;
  return normalizeUrl(host + "/" + path);
};

export const SKETCHES_URL = "/sketches/list";
export const ALL_SKETCHES_URL = "/sketches/all";
export const PLAYLISTS_URL = "/my-playlists";
