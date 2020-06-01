import React, { useEffect, useRef, useState } from "react";
import { BsFillPlayFill } from 'react-icons/bs';
// import Logo from "./logo.svg";
import { buildHex } from "./compiler/compile";
import { prepareCode } from "./code";
import Simulator from "./Simulator";
import { Link } from "react-router-dom";
import { Mode, useLightSwitch } from "use-light-switch";

import Monaco from 'react-monaco-editor';

const App = ({ code: originalCode, sketch, save }) => {
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

  useEffect(() => {
    // window.require(["https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.18.1/min/vs/editor/editor.main.js"], () => {
    //   monacoInstance.current = monaco.editor.create(editor.current, {
    //     value: code,
    //     language: "cpp",
    //     theme: dark ? "vs-dark" : "vs-light",
    //     // automaticLayout: true,
    //     scrollBeyondLastLine: false,
    //     tabSize: 2,
    //     lineNumbers: false,
    //     showFoldingControls: false,
    //     glyphMargin: false,
    //     folding: false,
    //     minimap: {
    //       enabled: false,
    //     },
    //   });
    monacoInstance.current.editor.getModel().onDidChangeContent((event) => {
      const editorCode = monacoInstance.current.editor.getModel().getValue();
      setSketches(sketches);
    });
    const cmdS = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S;
    monacoInstance.current.editor.addCommand(cmdS, () => {
      buildCode(true);
    });
    buildCode();
    // });

    return () => {
      editor.current.innerHTML = "";
      monacoInstance.current.editor = undefined;
    };
  }, []);

  const resizeEditor = () => {
    monacoInstance.current.editor?.layout();
  }

  useEffect(() => {
    window.addEventListener('resize', resizeEditor);

    return () => window.removeEventListener('resize', resizeEditor);
  }, [])

  useEffect(() => {
    //   window.require(["vs/editor/editor.main"], () => {
    // monacoInstance.current?.editor.setTheme(dark ? "vs-dark" : "vs-light");
    //   });
  }, [dark]);

  return (
    <div className="app-container">
      <div className="editor">
        <div className="code-editor-wrapper">
          <div className="code-editor" ref={editor}>
            <Monaco
              ref={monacoInstance}
              options={{
                value: code,
                language: "cpp",
                theme: dark ? "vs-dark" : "vs-light",
                // automaticLayout: true,
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
        </div>
      </div>

      <div className="pixels">
        <div className="simulator">
          {/* {!build && <Logo className="loader" />} */}

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

        <div className="compiler-output">
          <pre id="compiler-output-text">{build && (build.stderr || build.stdout)}</pre>
        </div>
      </div>
    </div>
  );
};

export default App;
