import "regenerator-runtime/runtime";

import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

import Main from "./main2";
import React from "react";
import ReactDOM from "react-dom";
import { setConfig } from "react-hot-loader";

require("./index.pcss");

require("@tailwindcss/ui");

setConfig({
  ErrorOverlay: () => {
    window.location.reload();
    return null;
  },
});

require("v8-compile-cache");

self.MonacoEnvironment = {
  getWorker: function (_moduleId, _label) {
    return new Worker(
      "../node_modules/monaco-editor/esm/vs/editor/editor.worker.js"
    );
  },
};

monaco.editor.createWebWorker({});

ReactDOM.render(<Main />, document.getElementById("root"));
