import React, {useEffect, useRef, useState} from "react";
import {MdSettings} from "react-icons/md";
import debounce from "lodash/debounce";
import {GrInProgress} from "react-icons/gr";
import {BsFillPlayFill} from "react-icons/bs";
import {IoMdCloudUpload} from "react-icons/io";
import Logo from "./logo.svg";
import {buildHex, getFullBuild} from "./compiler/compile";
import {prepareCode, prepareFullCode} from "./code";
import Simulator from "./Simulator";
import {Link} from "react-router-dom";
import {Mode, useLightSwitch} from "use-light-switch";
import Monaco from "react-monaco-editor";
import request from "request";
import useDebounce from "./useDebounce";

const Editor = ({
  code: originalCode,
  name,
  save,
  soulmate,
  config = {},
  onChange,
}) => {
  let monacoInstance = useRef(false);
  let buildNumber = useRef(0);
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;
  const editor = useRef();
  const [build, setBuild] = useState();
  const [sketches, setSketches] = useState([]);
  const [code, setCode] = useState(originalCode);
  const [flashing, setFlashing] = useState(false);
  const [showConfiguration, setShowConfiguration] = useState(false);
  const [milliamps, setMilliamps] = useState(700);
  const [rows, setRows] = useState(config.rows || 70);
  const [cols, setCols] = useState(config.cols || 15);
  const [chipType, setChipType] = useState(config.chipType || "atom");
  const [ledType, setLedType] = useState(config.ledType || "APA102");

  useEffect(() => {
    buildCode(false);
  }, [useDebounce(cols, 1000), useDebounce(rows, 1000)]);

  useEffect(() => {
    setBuild(false);
  }, [cols, rows]);

  const buildCode = async (shouldSave = false) => {
    setBuild(undefined);
    buildNumber.current++;
    const buildNumberAtStart = buildNumber.current;
    const editorCode = monacoInstance.current.editor.getModel().getValue();
    const config = {
      rows,
      cols,
      chipType,
      ledType,
    };
    if (shouldSave) save(editorCode, config);
    const preparedCode = prepareCode(editorCode, rows, cols);
    const newBuild = await buildHex(preparedCode);
    if (buildNumber.current !== buildNumberAtStart) return;
    setBuild(newBuild);
  };

  const makeBuild = async () => {
    if (!soulmate) return;

    setFlashing(true);

    const editorCode = monacoInstance.current.editor.getModel().getValue();
    const preparedCode = prepareFullCode(
      name,
      editorCode,
      rows,
      cols,
      chipType,
      ledType,
      milliamps
    );
    const build = await getFullBuild(preparedCode);

    const ip = soulmate.addresses[0];
    const url = `http://${ip}/ota`;

    var body = new FormData();
    const contents = fs.readFileSync(build);
    body.append("image", new Blob([contents]), "firmware.bin");
    fetch(url, {
      method: "POST",
      body: body,
      mode: "no-cors",
      headers: {
        "Content-Length": fs.statSync(build).size,
      },
    }).then((response) => {
      setFlashing(false);
    });
  };

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    monacoInstance.current.editor.getModel().onDidChangeContent((event) => {
      const editorCode = monacoInstance.current.editor.getModel().getValue();
      onChangeRef.current(editorCode);
    });

    const cmdS = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S;
    monacoInstance.current.editor.addCommand(cmdS, () => buildCode(true));
    buildCode();

    return () => {
      editor.current.innerHTML = "";
      monacoInstance.current.editor = undefined;
    };
  }, []);

  useEffect(() => {
    const cmdS = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S;
    monacoInstance.current.editor.addCommand(cmdS, () => buildCode(true));

    buildCode(true);
  }, [rows, cols, chipType, ledType]);

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

        {showConfiguration && (
          <div className="configuration">
            <p>
              <label>Rows</label>
              <input
                type="number"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
              />
            </p>
            <p>
              <label>LEDs</label>
              <select
                value={ledType}
                onChange={(e) => setLedType(e.target.value)}
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
                onChange={(e) => setCols(e.target.value)}
              />
            </p>
            <p>
              <label>Chip type</label>
              <select
                value={chipType}
                onChange={(e) => setChipType(e.target.value)}
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
                onChange={(e) => setMilliamps(e.target.value)}
              />
            </p>
          </div>
        )}

        <div className="toolbar">
          <div
            className={`configure button ${showConfiguration && "pressed"}`}
            onClick={() => setShowConfiguration(!showConfiguration)}
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
            Compile and run (CMD+S)
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

      <div className="pixels">
        <div className="simulator">
          {!build && <Logo className="loader" />}

          {build && (
            <Simulator
              build={build}
              cols={cols}
              rows={rows}
              width={cols * 10}
              height={rows * 10}
            />
          )}
        </div>

        {build?.stderr && (
          <div className="compiler-output">
            <pre id="compiler-output-text">{build.stderr}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
