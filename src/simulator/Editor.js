import React, { useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import { BsFillPlayFill } from "react-icons/bs";
import { IoMdCloudUpload } from "react-icons/io";
import Logo from "./logo.svg";
import { Mode, useLightSwitch } from "use-light-switch";
import Monaco from "react-monaco-editor";

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

const Editor = ({
  code,
  name,
  save,
  soulmate,
  config = defaultConfig,
  onBuild,
  build,
  flash,
}) => {
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

  const buildCode = async (shouldSave = false) => {
    const editorCode = monacoInstance.current.editor?.getModel().getValue();
    onBuild(editorCode);

    if (shouldSave) {
      save(editorCode, config);
    }
  };

  const makeBuild = async () => {
    if (!soulmate) return;

    const editorCode = monacoInstance.current.editor?.getModel().getValue();
    flash(soulmate, name, editorCode, rows, cols, chipType, ledType, milliamps);
  };

  const saveConfig = debounce((config) => {
    const editorCode = monacoInstance.current.editor?.getModel().getValue();
    save(editorCode, config);
  }, 500);

  // Effect hook for changing variables - need to recreate the event listener
  // for scope
  useEffect(() => {
    const cmdS = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S;
    monacoInstance.current.editor?.addCommand(cmdS, () => buildCode(true));
    buildCode();

    // This was causing crashes on hot reload
    // return () => {
    //   editor.current.innerHTML = "";
    //   monacoInstance.current.editor = undefined;
    // };
  }, [rows, cols, chipType, ledType]);

  // Resizing

  const resizeEditor = () => {
    monacoInstance.current.editor?.layout();
  };

  const debouncedResize = debounce(() => {
    resizeEditor();
  }, 500);

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

        {soulmate && (
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
