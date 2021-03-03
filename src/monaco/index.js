import "./monaco-language";

import * as monaco from "monaco-editor";

import { language, monarchLanguage } from "./monaco-cpp-arduino";
const languageExtensionPoint = { id: "soulmate" };
monaco.languages.register(languageExtensionPoint);
monaco.languages.setLanguageConfiguration("soulmate", monarchLanguage);
monaco.languages.onLanguage("soulmate", () => {
  monaco.languages.setMonarchTokensProvider("soulmate", language);
});

monaco.editor.createWebWorker({});
