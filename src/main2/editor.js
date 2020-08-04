import { Mode, useLightSwitch } from "use-light-switch";
import React, { useEffect, useRef, useState } from "react";

import Monaco from "react-monaco-editor";
import SelectionsContainer from "~/containers/selectionContainer";
import Simulator from "../simulator/Simulator";
import SketchesContainer from "~/containers/sketchesContainer";
import SoulmatesContainer from "~/containers/soulmatesContainer";
// import UserContainer from "~/containers/userContainer";
import debounce from "lodash/debounce";
import { emptyCode } from "~/utils/code";
import jsBeautifier from "js-beautify";
import { useContainer } from "unstated-next";

const editorConfig = {
  links: false,
  language: "cpp",
  scrollBeyondLastLine: false,
  tabSize: 2,
  lineNumbers: false,
  showFoldingControls: false,
  glyphMargin: false,
  folding: false,
  minimap: {
    enabled: false,
  },
};

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

const Editor = ({ id }) => {
  const sketch = {};
  const build = () => {};
  const onSave = () => {};
  const { getSelection, setSelection } = useContainer(SelectionsContainer);

  const {
    save,
    buildSketch,
    persistCode,
    // sketchIsMine,
    // cloneSketch,
  } = useContainer(SketchesContainer);

  // const { userDetails } = useContainer(UserContainer);

  const {
    getSelectedSoulmate,
    flashMultiple,
    getConfig,
    saveConfig,
  } = useContainer(SoulmatesContainer);

  const soulmate = getSelectedSoulmate();

  let code = sketch.dirtyCode || sketch.code || emptyCode;
  if (localStorage.autoFormat === "true") code = formatCode(code);

  const formatCheckboxRef = useRef();
  const config = soulmate ? getConfig(soulmate) : sketch.config;
  let monacoInstance = useRef(false);
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;
  const { rows, cols, ledType, chipType, milliamps } = config || {};
  const flashing = soulmate?.flashing;
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

    if (onSave) {
      onSave(editorCode);
    } else {
      buildSketch(sketch.id, editorCode, config);
      if (shouldSave) save(sketch.id, editorCode, config);
    }
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
    <div className="flex flex-col w-full">
      <div className="p-6 border-b">
        <div>
          <nav className="sm:hidden">
            <a
              href="#"
              className="flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              <svg
                className="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </a>
          </nav>
          <nav className="hidden sm:flex items-center text-sm leading-5 font-medium">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              Gallery
            </a>
            <svg
              className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              All patterns
            </a>
            <svg
              className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              Back End Developer
            </a>
          </nav>
        </div>
        <div className="mt-2 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
              Name
            </h2>
          </div>
          {/* <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
            <span className="shadow-sm rounded-md">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out"
              >
                Edit
              </button>
            </span>
            <span className="ml-3 shadow-sm rounded-md">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                Publish
              </button>
            </span>
          </div> */}
        </div>
      </div>

      <div className="flex flex-row flex-grow w-full">
        <div className="flex-grow relative min-w-0 bg-white">
          <Monaco
            key={dark ? "dark" : "light"}
            ref={monacoInstance}
            onChange={(code) => persistCode(sketch.id, code)}
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

          <label
            htmlFor="auto-format"
            className="absolute top-4 right-4 text-xs flex flex-row items-center justify-center"
          >
            Auto-format
            <input
              className="ml-2"
              defaultChecked={localStorage.autoFormat === "true"}
              type="checkbox"
              ref={formatCheckboxRef}
              onChange={(e) => {
                localStorage.autoFormat = e.target.checked;
                buildCode(false);
              }}
            />
          </label>
        </div>

        <div className="flex flex-col" style={{ width: 300 }}>
          <Simulator rows={20} cols={70} height={70} width={20} />
        </div>
      </div>
    </div>
  );
};

export default Editor;
