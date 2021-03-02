import parser from "@wokwi/gcc-output-parser";
import classnames from "classnames";
import jsBeautifier from "js-beautify";
import debounce from "lodash/debounce";
import startCase from "lodash/startCase";
import Monaco from "react-monaco-editor";
import { Mode, useLightSwitch } from "use-light-switch";

function isWindows() {
  return navigator.platform.indexOf("Win") > -1;
}

const LINE_OFFSET = 61;

const jsBeautifierConfig = {
  indent_size: 2,
  indent_empty_lines: true,
  brace_style: "collapse-preserve-inline",
};

const formatCode = (code) => {
  let result = jsBeautifier(code, jsBeautifierConfig);
  result = result.replace(/- >/g, "->");
  return result;
};

const editorConfig = {
  links: false,
  language: "soulmate",
  scrollBeyondLastLine: false,
  tabSize: 2,
  lineNumbers: true,
  showFoldingControls: true,
  folding: true,
  glyphMargin: false,
  minimap: {
    enabled: false,
  },
};

const CodeEditor = ({
  build,
  code,
  onChange,
  onSave,
  onChangeSelection,
  className,
  selection,
  autoFocus = false,
  autoFormat = true,
}) => {
  let monacoInstance = useRef(false);
  const [dirty, setDirty] = useState(false);

  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;
  const formatCheckboxRef = useRef();

  useEffect(() => {
    const monacoEditor = monacoInstance.current?.editor;

    if (autoFocus) {
      monacoEditor?.focus();
    }
  }, []);

  const resizeEditor = () => {
    const monacoEditor = monacoInstance.current?.editor;
    monacoEditor?.layout();
    setTimeout(() => {
      const monacoEditor = monacoInstance.current?.editor;
      monacoEditor?.layout();
    }, 10);
  };
  const debouncedResize = debounce(resizeEditor, 10);

  useEffect(() => {
    window.addEventListener("resize", debouncedResize);

    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  useEffect(() => {
    debouncedResize();
  }, [build?.stderr]);

  useEffect(() => {
    const monacoEditor = monacoInstance.current?.editor;
    const model = monacoEditor.getModel();
    let errors = [];

    if (build?.stderr) {
      errors = parser
        .parseString(build.stderr)
        .map(({ line, text, column, tokenLength }) => ({
          startLineNumber: line - LINE_OFFSET,
          startColumn: column,
          endLineNumber: line - LINE_OFFSET,
          endColumn: column + tokenLength,
          message: text,
          severity: monaco.MarkerSeverity.Error,
        }));
    }

    monaco.editor.setModelMarkers(model, "owner", errors);
    monacoEditor.setModel(model);
  }, [build]);

  const save = () => {
    // Build for the simulator
    const monacoEditor = monacoInstance.current?.editor;
    if (!monacoEditor) return;
    let editorCode = monacoEditor?.getModel().getValue();

    setDirty(false);

    if (formatCheckboxRef.current?.checked) {
      const formattedCode = formatCode(editorCode);
      const scroll = monacoEditor.getScrollTop();
      if (formattedCode !== editorCode) {
        editorCode = formattedCode;
        const position = monacoEditor.getSelection();
        monacoEditor.executeEdits("beautifier", [
          {
            identifier: "delete",
            range: new monaco.Range(1, 1, 10000, 1),
            text: "",
            forceMoveMarkers: true,
          },
        ]);
        monacoEditor.executeEdits("beautifier", [
          {
            identifier: "insert",
            range: new monaco.Range(1, 1, 1, 1),
            text: editorCode,
            forceMoveMarkers: true,
          },
        ]);
        monacoEditor.setSelection(position);
        monacoEditor.setScrollTop(scroll);
      }
    }

    onSave(editorCode);
  };

  // // Effect hook for changing variables - need to recreate the event listener
  // // for scope. Only do this after first mount.
  // // const mounted = useRef();
  useEffect(() => {
    const monacoEditor = monacoInstance.current?.editor;
    if (!monacoEditor) return;

    const cmdS = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S;

    monacoEditor?.addCommand(cmdS, () => {
      save();
    });

    if (onChangeSelection) {
      monacoEditor?.onDidChangeCursorSelection(({ selection }) => {
        onChangeSelection(selection);
      });
    }
  }, []);

  useEffect(() => {
    if (selection) {
      monacoInstance.current.editor?.setSelection(selection);
    }
  }, [selection]);

  return (
    <div
      className={classnames(
        className,
        "dark-mode:bg-gray-900 flex flex-col min-h-0",
        "min-w-0 min-h-0"
      )}
    >
      <div className="flex flex-grow flex-shrink h-0 min-h-0 overflow-hidden">
        <Monaco
          editorDidMount={(editor) => {
            editor.changeViewZones((accessor) => {
              accessor.addZone({
                afterLineNumber: 0,
                heightInPx: 8,
                domNode: document.createElement("SPAN"),
              });
            });
          }}
          key={dark ? "dark" : "light"}
          onChange={(code) => {
            onChange && onChange(code);
            setDirty(true);
          }}
          options={{
            ...editorConfig,
            value: code,
            theme: dark ? "vs-dark" : "vs-light",
          }}
          ref={monacoInstance}
        />
      </div>

      {build?.stderr && (
        <pre className="bottom-0 left-0 right-0 z-10 flex-shrink-0 px-6 py-3 overflow-auto text-sm text-red-800 break-all bg-red-200 border-t border-red-800 max-h-64">
          {!build.stderr.includes("\n") && <p>{build.stderr}</p>}
          {parser.parseString(build.stderr).map(
            ({ line, text, type }, i) =>
              type === "error" && (
                <p className="py-1" key={i}>
                  <strong>{startCase(type)}:</strong> Line {line - LINE_OFFSET}:{" "}
                  {text}
                </p>
              )
          )}
        </pre>
      )}

      {autoFormat && (
        <label
          className="absolute flex flex-row items-center justify-center text-xs top-2 right-8 dark-mode:text-white"
          htmlFor="auto-format"
        >
          Auto-format
          <input
            className="ml-2"
            defaultChecked={localStorage.autoFormat === "true"}
            onChange={(e) => {
              localStorage.autoFormat = e.target.checked;

              save();
            }}
            ref={formatCheckboxRef}
            type="checkbox"
          />
        </label>
      )}

      {dirty && (
        <span className="absolute inline-flex bottom-4 rounded-md shadow-sm right-8">
          <button
            className={classnames(
              "inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent leading-5 rounded-md hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-purple active:bg-purple-700 transition ease-in-out duration-150 z-50"
            )}
            disabled={!dirty}
            onClick={save}
            type="button"
          >
            Preview ({isWindows() ? "CTRL" : "CMD"}+S)
          </button>
        </span>
      )}
    </div>
  );
};

export default CodeEditor;
