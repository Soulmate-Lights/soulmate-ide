import React, { useEffect, useRef, useState } from "react";
import { GrInProgress } from "react-icons/gr";
import { BsFillPlayFill } from "react-icons/bs";
import { IoMdCloudUpload } from "react-icons/io";
import Logo from "./logo.svg";
import { buildHex, getFullBuild } from "./compiler/compile";
import { prepareCode, prepareFullCode } from "./code";
import Simulator from "./Simulator";
import { Link } from "react-router-dom";
import { Mode, useLightSwitch } from "use-light-switch";

import Monaco from "react-monaco-editor";
import request from "request";

const App = ({ code: originalCode, name, save, soulmate }) => {
  let monacoInstance = useRef(false);
  let buildNumber = useRef(0);
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;
  const editor = useRef();
  const [build, setBuild] = useState();
  const [sketches, setSketches] = useState([]);
  const [code, setCode] = useState(originalCode);
  const [cols, setCols] = useState(15);
  const [rows, setRows] = useState(70);
  const [flashing, setFlashing] = useState(false);

  const buildCode = async (shouldSave = false) => {
    setBuild(undefined);
    buildNumber.current++;
    const buildNumberAtStart = buildNumber.current;
    const editorCode = monacoInstance.current.editor.getModel().getValue();
    if (shouldSave) save(editorCode);
    const preparedCode = prepareCode(editorCode, rows, cols);
    const newBuild = await buildHex(preparedCode);
    if (buildNumber.current !== buildNumberAtStart) return;
    setBuild(newBuild);
  };

  const makeBuild = async () => {
    if (!soulmate) return;

    setFlashing(true);

    const editorCode = monacoInstance.current.editor.getModel().getValue();
    const preparedCode = prepareFullCode(name, editorCode, rows, cols);
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

  useEffect(() => {
    monacoInstance.current.editor.getModel().onDidChangeContent((event) => {
      const editorCode = monacoInstance.current.editor.getModel().getValue();
      setSketches(sketches);
    });
    const cmdS = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S;
    monacoInstance.current.editor.addCommand(cmdS, () => {
      buildCode(true);
    });
    buildCode();

    return () => {
      editor.current.innerHTML = "";
      monacoInstance.current.editor = undefined;
    };
  }, []);

  const resizeEditor = () => {
    monacoInstance.current.editor?.layout();
  };

  useEffect(() => {
    window.addEventListener("resize", resizeEditor);

    return () => window.removeEventListener("resize", resizeEditor);
  }, []);

  // useEffect(() => {
  //   //   //   window.require(["vs/editor/editor.main"], () => {
  //   monacoInstance?.current?.editor.setTheme(dark ? "vs-dark" : "vs-light");
  //   //   //   });
  // }, [dark]);

  return (
    <div className="app-container">
      <div className="editor">
        <div className="code-editor-wrapper">
          <div className="code-editor" ref={editor}>
            <Monaco
              key={dark ? "dark" : "notdark"}
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
        <div className="toolbar">
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
              width={150}
              height={700}
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

export default App;
