import { Mode, useLightSwitch } from "use-light-switch";

import Monaco from "react-monaco-editor";
import classnames from "classnames";
import debounce from "lodash/debounce";
import jsBeautifier from "js-beautify";
import parser from "@wokwi/gcc-output-parser";
import startCase from "lodash/startCase";

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
  language: "cpp",
  scrollBeyondLastLine: false,
  tabSize: 2,
  lineNumbers: false,
  showFoldingControls: true,
  folding: true,
  glyphMargin: false,
  minimap: {
    enabled: false,
  },
};

const codeEditor = ({
  build,
  code,
  onChange,
  onSave,
  onChangeSelection,
  className,
  selection,
}) => {
  let monacoInstance = useRef(false);

  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;
  const formatCheckboxRef = useRef();

  useEffect(() => {
    const monacoEditor = monacoInstance.current.editor;
    monacoEditor.focus();
  }, []);

  const resizeEditor = () => {
    const monacoEditor = monacoInstance.current.editor;
    monacoEditor?.layout();
    setTimeout(() => {
      const monacoEditor = monacoInstance.current.editor;
      monacoEditor?.layout();
    }, 10);
  };
  const debouncedResize = debounce(resizeEditor, 10);

  useEffect(() => {
    window.addEventListener("resize", debouncedResize);

    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  const save = () => {
    // Build for the simulator
    const monacoEditor = monacoInstance.current.editor;
    if (!monacoEditor) return;
    let editorCode = monacoEditor?.getModel().getValue();

    if (formatCheckboxRef.current.checked) {
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
    const monacoEditor = monacoInstance.current.editor;
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
    <div className={classnames(className, "dark-mode:bg-gray-900")}>
      <Monaco
        className="h-8"
        key={dark ? "dark" : "light"}
        ref={monacoInstance}
        onChange={onChange}
        editorDidMount={(editor) => {
          editor.changeViewZones((accessor) => {
            accessor.addZone({
              afterLineNumber: 0,
              heightInPx: 8,
              domNode: document.createElement("SPAN"),
            });
          });
        }}
        options={{
          ...editorConfig,
          value: code,
          theme: dark ? "vs-dark" : "vs-light",
        }}
      />

      {build?.stderr && (
        <pre className="bg-red-200 text-red-800 py-3 px-6 text-sm break-all absolute bottom-0 left-0 right-0 border-t border-red-800">
          {parser.parseString(build.stderr).map(
            ({ line, text, type }) =>
              type === "error" && (
                <p key={line} className="py-1">
                  <strong>{startCase(type)}:</strong> Line {line - 58}: {text}
                </p>
              )
          )}
        </pre>
      )}

      <label
        htmlFor="auto-format"
        className="absolute top-2 right-8 text-xs flex flex-row items-center justify-center dark-mode:text-white"
      >
        Auto-format
        <input
          className="ml-2"
          defaultChecked={localStorage.autoFormat === "true"}
          type="checkbox"
          ref={formatCheckboxRef}
          onChange={(e) => {
            localStorage.autoFormat = e.target.checked;

            save();
          }}
        />
      </label>
    </div>
  );
};

export default codeEditor;
