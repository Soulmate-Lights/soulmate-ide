import ReactDOM from "react-dom";
import React from "react";
import Simulator from "./simulator";
import history from "./utils/history";

/* eslint-disable-next-line no-unused-vars */
import * as monaco from "monaco-editor/esm/vs/editor/editor.main.js";

const App = () => {
  return <Simulator />;
};

self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId, _label) {
    return "./editor.worker.js";
  },
};

module.hot?.accept();

ReactDOM.render(<App />, document.getElementById("root"));
