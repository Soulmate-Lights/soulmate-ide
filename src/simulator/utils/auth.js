import createAuth0Client from "@auth0/auth0-spa-js";
import jwtDecode from "jwt-decode";
import history from "../../utils/history";
import config from "../../auth_config.json";

let auth0;

if (!window.auth && !auth0) {
  createAuth0Client({
    domain: config.domain,
    client_id: config.clientId,
  }).then(async (client) => {
    auth0 = client;
    window.auth0 = client;

    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      await auth0.handleRedirectCallback();

      const claim = await auth0?.getIdTokenClaims();
      localStorage.token = JSON.stringify(claim.__raw);

      const user = await auth0.getUser();
      localStorage.user = JSON.stringify(user);

      history.push("/");
    }
  });
}

export const getToken = async () => {
  if (localStorage.token) return JSON.parse(localStorage.token);

  if (window.auth) {
    return await auth.getToken();
  } else {
    // return await window.auth0.getTokenSilently();

    const claim = await window.auth0?.getIdTokenClaims();
    return claim.__raw;
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

  if (window.auth) {
    const id_token = window.auth?.tokenProperties?.id_token;
    return jwtDecode(id_token);
  } else {
    return await auth0.getUser();
  }
};

export const triggerLogin = async () => {
  if (window.auth) {
    return await auth.login();
  } else {
    await auth0.loginWithRedirect({
      redirect_uri: window.location.origin + "/auth",
    });
  }
};

export const triggerLogout = async () => {
  if (window.auth) {
    return await auth.logout();
  }
};
