import "regenerator-runtime/runtime";

import { get } from "~/utils";
const config = {
  domain: "yellow-boat-0900.auth0.com",
  clientId: "OsKmsunrgzhFv2znzUHpd9JsFSsOl46o",
};
import createAuth0Client from "@auth0/auth0-spa-js";
import * as SentryReact from "@sentry/react";
import jwtDecode from "jwt-decode";

import history from "~/utils/history";

import { post } from ".";
import isElectron from "./isElectron";

let auth0;

createAuth0Client({
  domain: config.domain,
  client_id: config.clientId,
}).then(async (client) => {
  auth0 = client;
  window.auth0 = client;

  const query = window.location.search;
  if (query.includes("code=") && query.includes("state=")) {
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

export const triggerLogin = async () => {
  if (isElectron()) {
    const id = Math.random();
    electron.shell.openExternal(
      // `https://editor.soulmatelights.com/desktop-sign-in?ot-auth-code=${id}`
      `http://localhost:3000/desktop-sign-in#${id}`
    );

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
  } else {
    if (!auth0) console.log("no auth0");
    await auth0.loginWithPopup();
    if (window.location.pathname === "/desktop-sign-in") {
      const code = window.location.hash.replace("#", "");
      post("/save-token", { code }).then(window.close);
    } else {
      return auth0.getIdTokenClaims().then((c) => c.__raw);
    }
  }
};
