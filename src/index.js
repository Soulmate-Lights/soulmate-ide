import "regenerator-runtime/runtime";
import "../tailwind.config";

import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";
import React from "react";
import ReactDOM from "react-dom";

import Main from "./main";

require("./index.pcss");
require("@tailwindcss/ui");

self.MonacoEnvironment = {
  getWorker: function (_moduleId, _label) {
    return new Worker(
      "../node_modules/monaco-editor/esm/vs/editor/editor.worker.js"
    );
  },
};

monaco.editor.createWebWorker({});

ReactDOM.render(<Main />, document.getElementById("root"));
