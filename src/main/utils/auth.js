import "regenerator-runtime/runtime";

const config = {
  domain: "yellow-boat-0900.auth0.com",
  clientId: "OsKmsunrgzhFv2znzUHpd9JsFSsOl46o",
};
import createAuth0Client from "@auth0/auth0-spa-js";
import * as SentryReact from "@sentry/react";
import jwtDecode from "jwt-decode";

import history from "~/utils/history";
import { url } from "~/utils/urls";

import { get, postWithToken } from ".";
import isElectron from "./isElectron";

let auth0;

createAuth0Client({
  domain: config.domain,
  client_id: config.clientId,
}).then(async (client) => {
  auth0 = client;
  window.auth0 = client;

  const query = window.location.search;
  if (query.includes("code=")) {
    if (document.location.pathname === "/desktop-callback") {
      const code = window.location.hash.replace("#", "");
      await auth0.handleRedirectCallback();
      const claim = await auth0?.getIdTokenClaims();
      const token = claim.__raw;
      postWithToken("/save-token", { code, token }).then(window.close);
      setTimeout(() => {
        window.close();
      }, 1000);
      // alert("We have a code");
      // debugger;
      // await auth0.handleRedirectCallback();
      // const claim = await auth0?.getIdTokenClaims();
      // localStorage.token = JSON.stringify(claim.__raw);
    } else {
      try {
        localStorage.loginPending = true;
        await auth0.handleRedirectCallback();

        const claim = await auth0?.getIdTokenClaims();
        localStorage.token = JSON.stringify(claim.__raw);

        const user = await auth0.getUser();
        localStorage.user = JSON.stringify(user);
        window.location.reload();
      } catch (e) {
        SentryReact.captureException(e);
      }

      history.push("/");
    }
  }
});

export const getTokenOnStartup = () => {
  if (window.auth) return window.auth.getToken();

  return Promise.resolve();
};

export const getToken = async () => {
  if (localStorage.token) return JSON.parse(localStorage.token);

  if (window.auth) {
    return window.auth.tokenProperties?.access_token;
  } else {
    const claim = await window.auth0?.getIdTokenClaims();
    return claim?.__raw;
  }
};

export const loggedIn = async () => {
  if (localStorage.token) return true;

  if (window.auth) {
    return !!window.auth.tokenProperties;
  } else {
    const result = await window.auth0?.isAuthenticated();
    return result;
  }
};

export const tokenProperties = async () => {
  if (localStorage.user) return JSON.parse(localStorage.user);

  if (localStorage.token) {
    return jwtDecode(localStorage.token);
  }

  return await auth0.getUser();
};

export const triggerLogin = async (code) => {
  if (isElectron()) {
    const id = Math.random();
    electron.shell.openExternal(url(`/desktop-sign-in#${id}`));

    return new Promise((resolve) => {
      const interval = setInterval(async () => {
        const response = await get("/desktop-code", { code: id });
        if (response.token) {
          localStorage.token = JSON.stringify(response.token);
          clearInterval(interval);
          remote.getCurrentWindow().show();
          resolve(response.token);
        }
      }, 1000);
    });
  } else if (code) {
    if (!auth0) console.log("no auth0");
    await auth0.loginWithRedirect({
      redirect_uri: url(`/desktop-callback#${code}`),
    });
    if (window.location.pathname === "/desktop-callback") {
      // const code = window.location.hash.replace("#", "");
      const token = await getToken();
      alert("Save token");
      postWithToken("/save-token", { code, token }).then(window.close);
    } else {
      return auth0.getIdTokenClaims().then((c) => c.__raw);
    }
  } else {
    await auth0.loginWithPopup();
    return auth0.getIdTokenClaims().then((c) => c.__raw);
  }
};
