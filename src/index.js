import ReactDOM from "react-dom";
import React from "react";
import Simulator from "./simulator";

/* eslint-disable-next-line no-unused-vars */
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

import "regenerator-runtime/runtime";

const App = () => {
  return <Simulator />;
};

self.MonacoEnvironment = {
  getWorker: function (_moduleId, _label) {
    return new Worker(
      "../node_modules/monaco-editor/esm/vs/editor/editor.worker.js"
    );
  },
};

monaco.editor.createWebWorker({});

module.hot?.accept();

ReactDOM.render(<App />, document.getElementById("root"));
