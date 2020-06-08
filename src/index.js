import "@babel/polyfill";
import ReactDOM from "react-dom";
import React from "react";
import Simulator from "./simulator";
import config from "./auth_config.json";
import { Auth0Provider } from "./react-auth0-spa";
import history from "./utils/history";

/* eslint-disable-next-line no-unused-vars */
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

const App = () => {
  return (
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.href}
      onRedirectCallback={onRedirectCallback}
      audience="https://yellow-boat-0900.auth0.com/api/v2/"
      responseType="token"
    >
      <Simulator />
    </Auth0Provider>
  );
};

self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId, _label) {
    return "./editor.worker.js";
  },
};

module.hot?.accept();

ReactDOM.render(<App />, document.getElementById("root"));
