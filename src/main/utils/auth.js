import "regenerator-runtime/runtime";

const config = {
  domain: "yellow-boat-0900.auth0.com",
  clientId: "OsKmsunrgzhFv2znzUHpd9JsFSsOl46o",
};
import createAuth0Client from "@auth0/auth0-spa-js";
import jwtDecode from "jwt-decode";

import { url } from "~/utils/urls";

import { get, postWithToken } from ".";
import isElectron from "./isElectron";

const auth0Promise = createAuth0Client({
  domain: config.domain,
  client_id: config.clientId,
});

export const tokenProperties = async () => {
  if (localStorage.token) return jwtDecode(localStorage.token);

  const auth0 = await auth0Promise;
  return await auth0.getUser();
};

export const triggerLogin = async () => {
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
  } else {
    try {
      const auth0 = await auth0Promise;
      await auth0.loginWithPopup();
      return auth0.getIdTokenClaims().then((c) => c.__raw);
    } catch {
      const auth0 = await auth0Promise;
      auth0.loginWithRedirect({
        redirect_uri: url("/"),
      });
    }
  }
};

export const signInDesktop = async () => {
  const code = document.location.hash.replace("#", "");
  const auth0 = await auth0Promise;
  auth0.loginWithRedirect({ redirect_uri: url(`desktop-callback#${code}`) });
};

export const callbackDesktop = async () => {
  const code = document.location.hash.replace("#", "");
  const auth0 = await auth0Promise;
  await auth0.handleRedirectCallback();
  const claim = await auth0?.getIdTokenClaims();
  const token = claim.__raw;
  postWithToken("/save-token", { code, token }).then(window.close);
};

export const handleRedirectCallback = async () => {
  const auth0 = await auth0Promise;
  await auth0.handleRedirectCallback();
  const user = await auth0.getUser();
  return user;
};
