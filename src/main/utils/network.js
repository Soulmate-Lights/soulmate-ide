import { auth0Promise } from "./auth";

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
