import "regenerator-runtime/runtime";

import createAuth0Client from "@auth0/auth0-spa-js";
import normalizeUrl from "normalize-url";

import { headersAndCredentials } from "~/utils/network";

import isElectron from "./isElectron";

const config = {
  domain: "yellow-boat-0900.auth0.com",
  client_id: "OsKmsunrgzhFv2znzUHpd9JsFSsOl46o",
  audience: "https://editor.soulmatelights.com/",
  scope: "openid profile email offline_access",
  cacheLocation: "localstorage",
  redirect_uri: isElectron()
    ? "https://editor.soulmatelights.com/"
    : window.location.origin,
  useRefreshTokens: true,
};

const specialKey = `@@auth0spajs@@::${config.client_id}::${config.audience}::${config.scope}`;

export var auth0Promise = () => {};
if (window.crypto) {
  window.auth0Promise = auth0Promise = createAuth0Client(config);
}

if (isElectron()) {
  ipcRenderer
    .invoke("get-password", window.require("os").userInfo().username)
    .then((key) => {
      if (key) localStorage[specialKey] = key;
    });
}

// Special URLs used for login
const host = "https://editor.soulmatelights.com";
const url = (path) => normalizeUrl(host + "/" + path);

// HTTP
const get = async (path, params) => {
  return fetch(url(path) + "?" + new URLSearchParams(params), {
    ...(await headersAndCredentials()),
  }).then((d) => d.json());
};

const postWithToken = async (path, params) => {
  return fetch(url(path), {
    method: "post",
    ...(await headersAndCredentials()),
    body: JSON.stringify({ ...params }),
  }).then((d) => d.json());
};

export const logIn = async () => {
  const auth0 = await auth0Promise;

  if (isElectron()) {
    // Generate a random ID to share with the server
    const id = Math.random();

    // Log in on the server
    electron.shell.openExternal(url(`/desktop-sign-in#${id}`));

    // And now just ping it until we hear back
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        const response = await get("/desktop-code", { code: id });
        if (!response.token) return;
        clearInterval(interval);
        localStorage[specialKey] = response.token;

        try {
          ipcRenderer.invoke(
            "set-password",
            window.require("os").userInfo().username,
            response.token
          );
        } catch (e) {
          console.log("Error saving to keytar:", e);
        }

        remote.getCurrentWindow().show();
        resolve(auth0.getUser());
      }, 1000);
    });
  } else {
    try {
      await auth0.loginWithPopup();
    } catch (e) {
      console.error("Error logging in with popup", e);
    }

    return auth0.getUser();
  }
};

// Called on page first load by the user container
export const logBackIn = async () => {
  const auth0 = await auth0Promise;
  const { search, pathname, hash } = window.location;
  const code = hash.replace("#", "");
  let token, user;

  console.log("Logging back in");

  try {
    token = await auth0.getTokenSilently();
    if (token) {
      user = await auth0.getUser();
      console.log("Welcome back!");
    } else {
      console.log("No token.");
    }
  } catch (e) {
    console.log("Exception getting token", e);
  }

  const authToken = localStorage[specialKey];

  if (pathname === "/desktop-sign-in") {
    const redirect_uri = url(`/desktop-callback#${code}`);

    if (token && authToken) {
      await postWithToken("/save-token", { code, token: authToken });
      window.location = redirect_uri;
      return user;
    } else {
      auth0.loginWithRedirect({ redirect_uri });
    }
  } else if (pathname === "/desktop-callback") {
    try {
      await auth0.handleRedirectCallback();
      await postWithToken("/save-token", { code, token: authToken });
    } catch (e) {
      console.log("Error parsing desktop-callback", e);
    }
  }

  if (search.includes("code=")) await auth0.handleRedirectCallback();

  return auth0.getUser();
};

// Called when clicking a button
export const logOut = async () => {
  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  const auth0 = await auth0Promise;

  if (isElectron()) {
    const username = window.require("os").userInfo().username;
    ipcRenderer.invoke("delete-password", username);

    remote.require("electron").session.defaultSession.clearStorageData;
    auth0.logout();
  } else {
    auth0.logout({ returnTo: window.location.origin });
  }
};
