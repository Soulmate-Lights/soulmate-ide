import ReactDOM from "react-dom";
import React from "react";
import Simulator from "./simulator";
import "regenerator-runtime/runtime";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

const App = () => <Simulator />;

self.MonacoEnvironment = {
  getWorker: function (_moduleId, _label) {
    return new Worker(
      "../node_modules/monaco-editor/esm/vs/editor/editor.worker.js"
    );
  },
};

monaco.editor.createWebWorker({});

ReactDOM.render(<App />, document.getElementById("root"));
