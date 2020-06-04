import "@babel/polyfill";
import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css"; // optional
import App from "./App";
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    return "./editor.worker.js";
  },
};

module.hot?.accept();

ReactDOM.render(<App />, document.getElementById("root"));
