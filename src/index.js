import "regenerator-runtime/runtime";
import "../tailwind.config";

import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import React from "react";
import ReactDOM from "react-dom";

import Main from "./main";

require("./index.pcss");
require("@tailwindcss/ui");

import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";

Sentry.init({
  dsn:
    "https://d71092cee93f41a1a5c02404ad236f82@o141622.ingest.sentry.io/5433159",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

self.MonacoEnvironment = {
  getWorker: function (_moduleId, _label) {
    return new Worker(
      "../node_modules/monaco-editor/esm/vs/editor/editor.worker.js"
    );
  },
};

monaco.editor.createWebWorker({});

ReactDOM.render(<Main />, document.getElementById("root"));
