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

const defaultConfig = {
  rows: 70,
  cols: 15,
  chipType: "atom",
  ledType: "APA102",
  milliamps: 700,
};

const Editor = ({ config = defaultConfig, sketch, build }) => {
  const { code, name } = sketch;
  const { save, buildSketch } = useContainer(SketchesContainer);
  const { soulmate, flash } = useContainer(SoulmatesContainer);

  let monacoInstance = useRef(false);
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;
  const editor = useRef();
  const {
    rows = 70,
    cols = 15,
    ledType = "APA102",
    chipType = "atom",
    milliamps = 700,
  } = config;
  const flashing = soulmate?.flashing;

  const [configuring, setConfiguring] = useState(!!soulmate);

  const buildCode = async (shouldSave = false) => {
    const editorCode = monacoInstance.current.editor?.getModel().getValue();
    buildSketch(sketch.id, editorCode);

    if (shouldSave) save(sketch.id, editorCode, config);
  };

  const saveConfig = debounce((config) => {
    const editorCode = monacoInstance.current.editor?.getModel().getValue();
    save(sketch.id, editorCode, config);
  }, 500);

  const makeBuild = async () => {
    if (!soulmate) return;

    const editorCode = monacoInstance.current.editor?.getModel().getValue();
    flash(soulmate, name, editorCode, rows, cols, chipType, ledType, milliamps);
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
    <div className="app-container">
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
                defaultValue={rows}
                onChange={(e) => {
                  const rows = parseInt(e.target.value);
                  saveConfig({ ...config, rows });
                }}
              />
            </p>
            <p>
              <label>LEDs</label>
              <select
                defaultValue={ledType}
                onChange={(e) => {
                  saveConfig({ ...config, ledType: e.target.value });
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
                defaultValue={cols}
                onChange={(e) => {
                  const cols = parseInt(e.target.value);
                  saveConfig({ ...config, cols });
                }}
              />
            </p>
            <p>
              <label>Chip type</label>
              <select
                defaultValue={chipType}
                onChange={(e) => {
                  saveConfig({ ...config, chipType: e.target.value });
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
                defaultValue={milliamps}
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
            Configure
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
                  Flashing to {soulmate.name}...
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <IoMdCloudUpload />
                  Flash to {soulmate.name}
                </React.Fragment>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
