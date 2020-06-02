import React, { Component, useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Custom from "./components/Custom";
import "./custom.css";

import App from "./simulator";

import config from "./auth_config.json";
import { Auth0Provider } from "./react-auth0-spa";

import history from "./utils/history";

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

export default () => {
  return (
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.href}
      // redirect_uri="https://yellow-boat-0900.auth0.com/"
      // redirect_uri="https://yellow-boat-0900.auth0.com/mobile"
      // redirect_uri={"file:///callback"}
      // redirect_uri={"soulmate:///callback"}
      onRedirectCallback={onRedirectCallback}
      audience="https://yellow-boat-0900.auth0.com/api/v2/"
      responseType="token"
    >
      <App />
    </Auth0Provider>
  );
};
