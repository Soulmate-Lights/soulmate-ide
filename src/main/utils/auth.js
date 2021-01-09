import "regenerator-runtime/runtime";

import createAuth0Client from "@auth0/auth0-spa-js";

import { url } from "~/utils/urls";

import { get, postWithToken } from ".";
import isElectron from "./isElectron";

const config = {
  domain: "yellow-boat-0900.auth0.com",
  clientId: "OsKmsunrgzhFv2znzUHpd9JsFSsOl46o",
  audience: "https://editor.soulmatelights.com/",
  scope: "openid profile email",
};

const key = `@@auth0spajs@@::${config.clientId}::${config.audience}::${config.scope}`;
export const auth0Promise = createAuth0Client({
  domain: config.domain,
  client_id: config.clientId,
  audience: config.audience,
  cacheLocation: "localstorage",
});

window.auth0Promise = auth0Promise;

export const triggerLogin = async () => {
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
        localStorage[key] = response.token;
        remote.getCurrentWindow().show();
        resolve(auth0.getUser());
      }, 1000);
    });
  } else {
    try {
      await auth0.loginWithPopup();
      return auth0.getUser();
    } catch {
      auth0.loginWithRedirect({ redirect_uri: url("/") });
    }
  }
};

// Called on page first load by the user container!
export const handleLogin = async () => {
  const pathname = window.location.pathname;
  if (pathname === "/desktop-sign-in") signInDesktop();
  if (pathname === "/desktop-callback") callbackDesktop();

  if (window.location.search.includes("code=")) return handleRedirectCallback();

  const oauth = await auth0Promise;
  return oauth.getUser();
};

export const signInDesktop = async () => {
  const auth0 = await auth0Promise;

  const code = document.location.hash.replace("#", "");
  auth0.loginWithRedirect({ redirect_uri: url(`desktop-callback#${code}`) });
};

export const callbackDesktop = async () => {
  const auth0 = await auth0Promise;

  const code = document.location.hash.replace("#", "");
  await auth0.handleRedirectCallback();
  const token = localStorage[key];

  await postWithToken("/save-token", { code, token });
};

export const handleRedirectCallback = async () => {
  const auth0 = await auth0Promise;

  await auth0.handleRedirectCallback();
  const user = await auth0.getUser();
  return user;
};

export const triggerLogout = async () => {
  const auth0 = await auth0Promise;
  auth0.logout({
    returnTo: window.location.href,
  });

  var cookies = document.cookie.split(";");
  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }

  if (isElectron()) {
    remote.require("electron").session.defaultSession.clearStorageData;
  }

  delete localStorage.loginSaved;
};
