import "regenerator-runtime/runtime";
import "../tailwind.config";
import "./monaco";

import { RewriteFrames } from "@sentry/integrations";
import * as SentryReact from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import React from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader";

import isDev from "~/utils/isDev";

import Main from "./main";

require("@tailwindcss/ui");
require("./index.pcss");

SentryReact.init({
  dsn:
    !isDev() &&
    "https://d71092cee93f41a1a5c02404ad236f82@o141622.ingest.sentry.io/5433159",
  integrations: [new Integrations.BrowserTracing(), new RewriteFrames()],
  release: require("../package.json").version,
  environment: isDev() ? "development" : "production",
});

if (isDev()) console.log("Running development environment");

self.MonacoEnvironment = {
  getWorker: function (_moduleId, _label) {
    return new Worker(
      "../node_modules/monaco-editor/esm/vs/editor/editor.worker.js"
    );
  },
};

const HotMain = hot(module)((params) => <Main {...params} />);
ReactDOM.render(<HotMain />, document.getElementById("root"));
module.hot?.accept();

window.dataLayer = window.dataLayer || [];
function gtag() {
  window.dataLayer.push(arguments);
}
gtag("js", new Date());
gtag("config", "UA-131034779-4");
