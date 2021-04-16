import "./monaco-language";

import * as monaco from "monaco-editor";
import workerUrl from 'url:../editor.worker';

self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId, _label) {
    return new Worker(new URL(workerUrl));
  },
};

window.monaco = monaco;

import { language, monarchLanguage } from "./monaco-cpp-arduino";
const languageExtensionPoint = { id: "soulmate" };
monaco.languages.register(languageExtensionPoint);
monaco.languages.setLanguageConfiguration("soulmate", monarchLanguage);
monaco.languages.onLanguage("soulmate", () => {
  monaco.languages.setMonarchTokensProvider("soulmate", language);
  monaco.editor.createWebWorker({
    worker: new Worker(new URL(workerUrl), { module: true })
  });
});

