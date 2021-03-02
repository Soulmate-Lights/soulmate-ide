import * as monaco from "monaco-editor";
function createDependencyProposals(range) {
  // returning a static list of proposals, not even looking at the prefix (filtering is done by the Monaco editor),
  // here you could do a server side lookup
  const insertTextRules =
    monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;
  return [
    {
      label: "XY(x, y) - takes X and Y, and returns index",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "XY(${1:uint8_t x}, ${2:uint8_t x})",
      insertTextRules,
      range,
    },
    {
      label: "CRGB(red, green, blue)",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "CRGB(${1:red}, ${2:green}, ${3:blue})",
      insertTextRules,
      range,
    },
    {
      label: "CHSV(hue, saturation, brightness)",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "CHSV(${1:hue}, ${2:saturation}, ${3:brightness})",
      insertTextRules,
      range,
    },
    {
      label: "fadeToBlackBy(CRGB leds, int NUM_LEDS, int fade);",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "fadeToBlackBy(${1:leds}, ${2:NUM_LEDS}, ${3:64});",
      insertTextRules,
      range,
    },
    {
      label: "leds[index]",
      description: "The array of LEDs",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "leds[${1:0}]",
      insertTextRules,
      range,
    },
    {
      label: "NUM_LEDS",
      description: "The number of LEDs in your Soulmate",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "NUM_LEDS",
      insertTextRules,
      range,
    },
    {
      label: "COLS",
      description: "The number of columns in your LED matrix",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "COLS",
      insertTextRules,
      range,
    },
    {
      label: "ROWS",
      description: "The number of ropws in your LED matrix",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "COLS",
      insertTextRules,
      range,
    },
    {
      label: "for-loop: x/y",
      description: "Loop over all your LEDs",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText:
        "for (int x = 0; x < COLS; x++) {\n\
  for (int y = 0; y < ROWS; y++) {\n\
    ${1}\n\
  }\n\
}",
      insertTextRules,
      range,
    },
    {
      label: "for-loop: index",
      description: "Loop over all your LEDs",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText:
        "for (int i = 0; i < N_LEDS; i++) {\n\
  leds[i] = ${1:CRGB(255, 0, 0)};\n\
}",
      insertTextRules,
      range,
    },
    {
      label: "beatsin8 - 8-bit sine-wave function",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "beatsin8(${1:int bpm}, ${2:int minimum}, ${3:int maximum});",
      insertTextRules,
      range,
    },
    {
      label: "beatsin16 - 16-bit sine-wave function",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText:
        "beatsin16(${1:int bpm}, ${2:uint16_t minimum}, ${3:uint16_t maximum});",
      insertTextRules,
      range,
    },
    {
      label: "random16() - 16-bit random function",
      kind: monaco.languages.CompletionItemKind.Function,
      insertText: "random16(${1:uint16_t maximum});",
      insertTextRules,
      range,
    },
  ];
}

monaco.languages.registerCompletionItemProvider("cpp", {
  provideCompletionItems: function (model, position) {
    var word = model.getWordUntilPosition(position);
    var range = {
      startLineNumber: position.lineNumber,
      endLineNumber: position.lineNumber,
      startColumn: word.startColumn,
      endColumn: word.endColumn,
    };
    return {
      suggestions: createDependencyProposals(range),
    };
  },
});
