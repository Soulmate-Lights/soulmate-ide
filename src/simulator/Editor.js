import React, { useEffect, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { BsFillPlayFill } from "react-icons/bs";
import { MdSettings } from "react-icons/md";
import { FaUsb } from "react-icons/fa";
import { IoMdCloudUpload } from "react-icons/io";
import Logo from "./logo.svg";
import { Mode, useLightSwitch } from "use-light-switch";
import Monaco from "react-monaco-editor";
import { useContainer } from "unstated-next";
import SoulmatesContainer from "./soulmatesContainer.js";
import SelectionsContainer from "./selectionContainer";
import SketchesContainer from "./sketchesContainer.js";
import { emptyCode } from "./code";
import Config from "./config";

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
  const { getSelection, setSelection } = useContainer(SelectionsContainer);

  const { save, buildSketch, persistCode, sketchIsMine } = useContainer(
    SketchesContainer
  );

  const {
    getSelectedSoulmate,
    flashMultiple,
    getConfig,
    saveConfig,
  } = useContainer(SoulmatesContainer);

  const soulmate = getSelectedSoulmate();

  let code = sketch.dirtyCode || sketch.code || emptyCode;
  if (localStorage.autoFormat === "true") code = formatCode(sketch.code);

  const formatCheckboxRef = useRef();
  const config = soulmate ? getConfig(soulmate) : sketch.config;
  let monacoInstance = useRef(false);
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;
  const editor = useRef();
  const { rows, cols, ledType, chipType, milliamps } = config;
  const flashing = soulmate?.flashing;
  const [configuring, setConfiguring] = useState(false);

  // Effect hook for changing variables - need to recreate the event listener
  // for scope. Only do this after first mount.
  // const mounted = useRef();
  useEffect(() => {
    const monacoEditor = monacoInstance.current.editor;
    const cmdS = monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S;
    monacoEditor?.addCommand(cmdS, () => buildCode(true));
    monacoEditor?.onDidChangeCursorSelection(({ selection }) => {
      setSelection(sketch.id, selection);
    });

    if (!build) buildCode();

    if (getSelection(sketch.id)) {
      monacoEditor.setSelection(getSelection(sketch.id));
    }
  }, [rows, cols, chipType, ledType]);

  // Focus editor on mount
  useEffect(() => {
    const monacoEditor = monacoInstance.current.editor;
    monacoEditor.focus();
  }, []);

  // Resizing

  const resizeEditor = () => {
    const monacoEditor = monacoInstance.current.editor;
    monacoEditor?.layout();
  };
  const debouncedResize = debounce(resizeEditor, 100);

  useEffect(resizeEditor, [configuring]);

  useEffect(() => {
    window.addEventListener("resize", debouncedResize);

    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  // Build for the simulator
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

  // Flash over USB or WiFi
  const flash = async () => {
    if (!soulmate || flashing || soulmate.usbFlashingPercentage > -1) return;

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
        <Config
          config={{ cols, rows, milliamps, ledType, chipType }}
          setConfig={setConfig}
        />
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
            disabled={flashing || soulmate.usbFlashingPercentage > -1}
            onClick={flash}
          >
            {soulmate.usbFlashingPercentage > -1 ? (
              <>
                <Logo className="loader" />
                <progress
                  className="usb-flash"
                  value={soulmate.usbFlashingPercentage}
                  max="100"
                >
                  {soulmate.usbFlashingPercentage}%{" "}
                </progress>
              </>
            ) : (
              <>
                {flashing ? (
                  <React.Fragment>
                    <Logo className="loader" />
                    Flashing {sketch.name} to {soulmate.name}...
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    {soulmate.type === "usb" ? <FaUsb /> : <IoMdCloudUpload />}
                    Flash {sketch.name} to {soulmate.name}
                  </React.Fragment>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
