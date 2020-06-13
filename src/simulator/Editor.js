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
import SketchesContainer from "./sketchesContainer.js";

// TODO: Example for saving tabs?
// monacoInstance.current.editor.getModel().onDidChangeContent((event) => {
//   const editorCode = monacoInstance.current.editor.getModel().getValue();
// });

const Editor = ({ sketch, build }) => {
  const { code } = sketch;
  const { save, buildSketch } = useContainer(SketchesContainer);
  const { soulmate, flashMultiple, getConfig, saveConfig } = useContainer(
    SoulmatesContainer
  );

  const config = soulmate ? getConfig(soulmate) : sketch.config;

  let monacoInstance = useRef(false);
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;
  const editor = useRef();
  const { rows, cols, ledType, chipType, milliamps } = config;
  const flashing = soulmate?.flashing;

  const [configuring, setConfiguring] = useState(!!soulmate);

  const buildCode = async (shouldSave = false) => {
    const editorCode = monacoInstance.current.editor?.getModel().getValue();
    buildSketch(sketch.id, editorCode, config);

    if (shouldSave) save(sketch.id, editorCode, config);
  };

  const setConfig = (config) => {
    const editorCode = monacoInstance.current.editor?.getModel().getValue();
    if (soulmate) {
      saveConfig(soulmate, config);
    }
    save(sketch.id, editorCode, config);
  };

  const makeBuild = async () => {
    if (!soulmate) return;

    const editorCode = monacoInstance.current.editor?.getModel().getValue();
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
    const cmdS = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S;
    monacoInstance.current.editor?.addCommand(cmdS, () => buildCode(true));
    if (mounted.current) {
      buildCode();
    }
    mounted.current = true;
  }, [rows, cols, chipType, ledType]);

  // Build on mount if we don't have a build
  useEffect(() => {
    if (!build) buildCode();
  }, []);

  // Resizing

  const resizeEditor = () => monacoInstance.current.editor?.layout();
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
            options={{
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

      {configuring && (
        <div className="configuration">
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
                saveConfig({
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
          Save (CMD+S)
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
