import "regenerator-runtime/runtime";
import "../tailwind.config";
import "./monaco-language";

import { RewriteFrames } from "@sentry/integrations";
import * as SentryReact from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import * as monaco from "monaco-editor";
import React from "react";
import ReactDOM from "react-dom";

import isDev from "~/utils/isDev";

import Main from "./main";

require("@tailwindcss/ui");
require("./index.pcss");

SentryReact.init({
  dsn:
    !isDev &&
    "https://d71092cee93f41a1a5c02404ad236f82@o141622.ingest.sentry.io/5433159",
  integrations: [new Integrations.BrowserTracing(), new RewriteFrames()],
  release: require("../package.json").version,
  environment: process.env.NODE_ENV,
});

self.MonacoEnvironment = {
  getWorker: function (_moduleId, _label) {
    return new Worker(
      "../node_modules/monaco-editor/esm/vs/editor/editor.worker.js"
    );
  },
};

import { language } from "./monaco-cpp-arduino";
export const languageID = "soulmate";

const languageExtensionPoint = { id: languageID };
monaco.languages.register(languageExtensionPoint);
monaco.languages.onLanguage(languageID, () => {
  monaco.languages.setMonarchTokensProvider(languageID, language);
});

monaco.editor.createWebWorker({});

ReactDOM.render(<Main />, document.getElementById("root"));

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "UA-131034779-4");

module.hot?.accept();
