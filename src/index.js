import "regenerator-runtime/runtime";
import "regenerator-runtime/runtime";

import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

import Main from "./main";
import React from "react";
import ReactDOM from "react-dom";
import { setConfig } from "react-hot-loader";

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
