import React, { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { BsFillPlayFill } from "react-icons/bs";
import { MdSettings } from "react-icons/md";
import { IoMdCloudUpload } from "react-icons/io";
import Logo from "./logo.svg";
import { Mode, useLightSwitch } from "use-light-switch";
import Monaco from "react-monaco-editor";
import { useContainer } from "unstated-next";
import SoulmatesContainer from "./soulmatesContainer.js";
import SelectionsContainer from "./selectionContainer";
import SketchesContainer from "./sketchesContainer.js";
import { emptyCode } from "./code";

import jsBeautifier from "js-beautify";

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

// TODO: Example for saving tabs?
// monacoInstance.current.editor.getModel().onDidChangeContent((event) => {
//   const editorCode = monacoInstance.current.editor.getModel().getValue();
// });

const Editor = ({ sketch, build }) => {
  let code = sketch.dirtyCode || sketch.code;
  if (localStorage.autoFormat === "true") {
    code = formatCode(sketch.code);
  }

  const { getSelection, setSelection } = useContainer(SelectionsContainer);

  const { save, buildSketch, persistCode, sketchIsMine } = useContainer(
    SketchesContainer
  );

  const { soulmate, flashMultiple, getConfig, saveConfig } = useContainer(
    SoulmatesContainer
  );

  const formatCheckboxRef = useRef();

  const config = soulmate ? getConfig(soulmate) : sketch.config;

  let monacoInstance = useRef(false);
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;
  const editor = useRef();
  const { rows, cols, ledType, chipType, milliamps } = config;
  const flashing = soulmate?.flashing;

  const [configuring, setConfiguring] = useState(!!soulmate);

  useEffect(() => {
    const monacoEditor = monacoInstance.current.editor;

    monacoEditor.focus();
    if (!build) buildCode();

    if (getSelection(sketch.id)) {
      monacoEditor.setSelection(getSelection(sketch.id));
    }

    return () => {
      setSelection(sketch.id, monacoInstance.current.editor.getSelection());
    };
  }, [sketch.id]);

  const buildCode = async (shouldSave = false) => {
    const monacoEditor = monacoInstance.current.editor;
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

    buildSketch(sketch.id, editorCode, config);
    if (shouldSave) save(sketch.id, editorCode, config);
  };

  const setConfig = (config) => {
    const monacoEditor = monacoInstance.current.editor;
    const editorCode = monacoEditor?.getModel().getValue();
    if (soulmate) {
      saveConfig(soulmate, config);
    } else {
      save(sketch.id, editorCode, config);
    }
  };

  const makeBuild = async () => {
    if (!soulmate) return;

    const monacoEditor = monacoInstance.current.editor;
    const editorCode = monacoEditor?.getModel().getValue();

    flashMultiple(
      soulmate,
      [{ ...sketch, code: editorCode }],
      rows,
      cols,
      chipType,
      ledType,
      milliamps
    );
  };

  // Effect hook for changing variables - need to recreate the event listener
  // for scope. Only do this after first mount.
  const mounted = useRef();
  useEffect(() => {
    const monacoEditor = monacoInstance.current.editor;
    const cmdS = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S;
    monacoEditor?.addCommand(cmdS, () => buildCode(true));
    if (mounted.current) {
      buildCode();
    }
    mounted.current = true;
  }, [rows, cols, chipType, ledType]);

  // Resizing

  const resizeEditor = () => {
    const monacoEditor = monacoInstance.current.editor;
    monacoEditor?.layout();
  };
  const debouncedResize = debounce(resizeEditor, 100);

  useEffect(() => {
    window.addEventListener("resize", debouncedResize);

    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  return (
    <div className="editor">
      <div className="code-editor-wrapper">
        <div className="code-editor" ref={editor}>
          <Monaco
            key={dark ? "dark" : "light"}
            ref={monacoInstance}
            onChange={(code) => {
              persistCode(sketch.id, code);
            }}
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
              links: false,
              value: code,
              language: "cpp",
              theme: dark ? "vs-dark" : "vs-light",
              scrollBeyondLastLine: false,
              tabSize: 2,
              lineNumbers: false,
              showFoldingControls: false,
              glyphMargin: false,
              folding: false,
              minimap: {
                enabled: false,
              },
            }}
          />
        </div>
      </div>
      <label htmlFor="auto-format" className="auto-format-checkbox">
        Auto-format
        <input
          id="auto-format"
          defaultChecked={localStorage.autoFormat === "true"}
          type="checkbox"
          ref={formatCheckboxRef}
          onChange={(e) => {
            localStorage.autoFormat = e.target.checked;
            buildCode(false);
          }}
        />
      </label>
      {configuring && (
        <div className="configuration">
          <p>
            <label>Columns</label>
            <input
              type="number"
              value={cols}
              onChange={(e) => {
                const cols = parseInt(e.target.value);
                setConfig({ ...config, cols });
              }}
            />
          </p>
          <p>
            <label>LEDs</label>
            <select
              value={ledType}
              onChange={(e) => {
                setConfig({ ...config, ledType: e.target.value });
              }}
            >
              <option value="APA102">APA102</option>
              <option value="WS2812B">WS2812B</option>
            </select>
          </p>
          <p>
            <label>Rows</label>
            <input
              type="number"
              value={rows}
              onChange={(e) => {
                const rows = parseInt(e.target.value);
                setConfig({ ...config, rows });
              }}
            />
          </p>
          <p>
            <label>Chip type</label>
            <select
              value={chipType}
              onChange={(e) => {
                setConfig({ ...config, chipType: e.target.value });
              }}
            >
              <option value="atom">M5 Atom</option>
              <option value="d32">Lolin ESP32</option>
            </select>
          </p>
          <p>
            <label>Shape</label>
            <select disabled>
              <option>Rectangle</option>
              <option>Cylinder</option>
              <option>Hexagon</option>
            </select>
          </p>
          <p>
            <label>Power (mA)</label>
            <input
              type="number"
              step="100"
              value={milliamps}
              onChange={(e) => {
                setConfig({
                  ...config,
                  milliamps: parseInt(e.target.value),
                });
              }}
            />
          </p>
        </div>
      )}
      <div className="toolbar">
        <div
          className={`configure button ${configuring && "pressed"}`}
          onClick={() => setConfiguring(!configuring)}
        >
          <MdSettings />
          Configure {soulmate?.name || sketch.name}
        </div>
        <div
          className="button"
          disabled={!build}
          onClick={() => buildCode(true)}
        >
          <BsFillPlayFill />
          {sketchIsMine(sketch) ? "Save" : "Preview"} (CMD+S)
        </div>

        {soulmate && (
          <div
            className="button"
            disabled={flashing}
            onClick={() => {
              !flashing && makeBuild();
            }}
          >
            {flashing ? (
              <React.Fragment>
                <Logo className="loader" />
                Flashing {sketch.name} to {soulmate.name}...
              </React.Fragment>
            ) : (
              <React.Fragment>
                <IoMdCloudUpload />
                Flash {sketch.name} to {soulmate.name}
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
