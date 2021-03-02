import "./monaco-language";

import * as monaco from "monaco-editor";

import { language } from "./monaco-cpp-arduino";
export const languageID = "soulmate";

const languageExtensionPoint = { id: languageID };
monaco.languages.register(languageExtensionPoint);
monaco.languages.onLanguage(languageID, () => {
  monaco.languages.setMonarchTokensProvider(languageID, language);
});

monaco.editor.createWebWorker({});
