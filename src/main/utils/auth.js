import "regenerator-runtime/runtime";

import createAuth0Client from "@auth0/auth0-spa-js";

import { clientSideUrl, url } from "~/utils/urls";

import { get, postWithToken } from ".";
import isElectron from "./isElectron";

const config = {
  domain: "yellow-boat-0900.auth0.com",
  clientId: "OsKmsunrgzhFv2znzUHpd9JsFSsOl46o",
  audience: "https://editor.soulmatelights.com/",
  scope: "openid profile email",
};

const specialKey = `@@auth0spajs@@::${config.clientId}::${config.audience}::${config.scope}`;

export const auth0Promise = createAuth0Client({
  domain: config.domain,
  client_id: config.clientId,
  audience: config.audience,
  cacheLocation: "localstorage",
});

export const logIn = async () => {
  const auth0 = await auth0Promise;

  if (isElectron()) {
    // Generate a random ID to share with the server
    const id = Math.random();

    // Log in on the server
    const url = clientSideUrl(`/desktop-sign-in#${id}`);
    electron.shell.openExternal(url);

    // And now just ping it until we hear back
    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        const response = await get("/desktop-code", { code: id });
        if (!response.token) return;
        clearInterval(interval);
        localStorage[specialKey] = response.token;
        remote.getCurrentWindow().show();
        resolve(auth0.getUser());
      }, 1000);
    });
  } else {
    try {
      await auth0.loginWithPopup();
    } catch {
      await auth0.loginWithRedirect({ redirect_uri: url("/") });
    }

    return auth0.getUser();
  }
};

// Called on page first load by the user container
export const logBackIn = async () => {
  const auth0 = await auth0Promise;
  const { search, pathname } = window.location;

  if (pathname === "/desktop-sign-in") {
    const code = document.location.hash.replace("#", "");
    const redirect_uri = clientSideUrl(`/desktop-callback#${code}`);
    auth0.loginWithRedirect({ redirect_uri });
  } else if (pathname === "/desktop-callback") {
    await auth0.handleRedirectCallback();
    const code = document.location.hash.replace("#", "");
    const token = localStorage[specialKey];
    await postWithToken("/save-token", { code, token });
  }

  if (search.includes("code=")) await auth0.handleRedirectCallback();

  const oauth = await auth0Promise;
  return oauth.getUser();
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
    remote.require("electron").session.defaultSession.clearStorageData;
    auth0.logout({ returnTo: window.location.href });
  } else {
    auth0.logout({ returnTo: window.location.origin });
  }
};
