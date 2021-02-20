import { drawPixels } from "@elliottkember/leduino";
import useEventListener from "@use-it/event-listener";
import _ from "lodash";
import { useCallback } from "react";
import { BsFillPauseFill, BsPlayFill } from "react-icons/bs";
import { FiCast } from "react-icons/fi";

import SoulmatesMenu from "~/components/SoulmatesMenu";
import SoulmatesContainer from "~/containers/soulmates";
import Logo from "~/images/logo.svg";
import soulmateName from "~/utils/soulmateName";

import ResolutionPopup from "./resolutionPopup";
import { calculateDimensions } from "./utils";

let worker;

// prettier-ignore
const coordsX = [ 133, 156, 165, 168, 165, 158, 147, 132, 114, 95, 76, 57, 41, 28, 19, 15, 17, 24, 37, 56, 123, 96, 73, 53, 38, 28, 24, 25, 31, 41, 55, 71, 89, 106, 122, 136, 146, 152, 152, 143, 138, 136, 128, 115, 101, 85, 70, 56, 44, 37, 33, 34, 41, 53, 69, 90, 114, 140, 167, 226, 204, 180, 154, 129, 106, 85, 67, 54, 46, 43, 44, 50, 60, 72, 86, 100, 113, 123, 128, 117, 104, 90, 78, 67, 59, 54, 54, 59, 68, 82, 100, 121, 143, 167, 191, 212, 231, 246, 255, 251, 251, 245, 233, 218, 199, 178, 156, 134, 114, 96, 82, 73, 67, 66, 70, 78, 89, 103, 111, 94, 84, 80, 81, 86, 96, 109, 126, 145, 165, 185, 204, 220, 233, 241, 244, 241, 232, 217, 179, 201, 217, 229, 235, 235, 230, 220, 207, 190, 172, 154, 136, 121, 108, 99, 95, 96, 104, 120, 110, 111, 118, 130, 144, 160, 176, 192, 206, 217, 224, 227, 224, 216, 202, 184, 162, 137, 110, 44, 68, 94, 120, 145, 168, 187, 202, 212, 216, 216, 212, 203, 191, 177, 162, 148, 135, 126, 122, 136, 147, 161, 174, 186, 197, 204, 206, 205, 198, 187, 172, 152, 130, 106, 81, 58, 36, 17, 0, 5, 15, 30, 49, 71, 93, 116, 138, 157, 173, 185, 192, 195, 193, 187, 178, 166, 152, 137, 149, 164, 175, 180, 182, 179, 171, 159, 143, 125, 105, 83, 63, 44, 28, 16, 9, 7, 12, 23 ]
// prettier-ignore
const coordsY = [ 126, 120, 109, 96, 82, 69, 57, 49, 45, 45, 50, 59, 74, 92, 114, 138, 163, 188, 211, 231, 255, 248, 235, 218, 198, 175, 152, 129, 107, 89, 74, 63, 57, 56, 59, 66, 76, 88, 102, 116, 103, 88, 77, 71, 68, 70, 77, 88, 103, 121, 141, 163, 184, 205, 222, 236, 245, 249, 247, 208, 224, 235, 241, 240, 234, 223, 209, 191, 172, 152, 132, 115, 101, 90, 84, 82, 86, 95, 114, 107, 98, 98, 103, 112, 126, 142, 159, 177, 195, 210, 222, 230, 233, 230, 223, 209, 191, 168, 142, 98, 125, 151, 174, 194, 209, 219, 223, 223, 218, 208, 195, 180, 164, 148, 134, 122, 114, 112, 123, 128, 138, 151, 165, 180, 193, 203, 211, 214, 212, 206, 194, 178, 158, 134, 109, 83, 58, 35, 11, 28, 48, 71, 95, 120, 142, 163, 179, 192, 200, 203, 202, 196, 187, 175, 162, 148, 136, 133, 152, 166, 177, 186, 190, 191, 187, 178, 165, 148, 128, 107, 84, 62, 41, 24, 11, 2, 0, 28, 16, 9, 8, 13, 23, 37, 55, 75, 96, 116, 135, 151, 164, 173, 177, 177, 172, 162, 146, 153, 161, 163, 160, 152, 139, 124, 106, 87, 69, 51, 36, 25, 18, 16, 20, 29, 44, 64, 133, 106, 81, 60, 44, 32, 26, 25, 29, 38, 50, 65, 82, 99, 115, 129, 140, 147, 148, 138, 134, 131, 122, 110, 95, 80, 65, 52, 42, 36, 34, 37, 45, 59, 77, 98, 123, 149, 176, 202 ];
const coordinates = [];
for (let i = 0; i < coordsX.length; i++) {
  coordinates[i] = [coordsX[i], coordsY[i]];
}

const Simulator = ({
  className,
  minWidth,
  maxWidth,
  style,
  build,
  config,
  hideResolutionMenu,
}) => {
  const canvas = useRef();
  const compilerOutputDiv = useRef();
  const [serialOutput, setSerialOutput] = useState("");
  const serialOutputRef = useRef("");
  const [hasPixels, setHasPixels] = useState(false);

  const {
    selectedSoulmate,
    setSavedConfig,
  } = SoulmatesContainer.useContainer();

  const isStreamingSoulmate =
    selectedSoulmate && selectedSoulmate.type !== "usb";

  const { rows, cols, serpentine } = config;
  const [paused, setPaused] = useState(false);
  useEventListener("blur", () => !selectedSoulmate && setPaused(true));
  useEventListener("focus", () => setPaused(false));

  // Websocket streaming

  const ws = useRef();
  useEffect(() => {
    if (!selectedSoulmate) return;
    if (!selectedSoulmate.addresses) return;
    ws.current = new WebSocket(`ws://${selectedSoulmate.addresses[0]}:81`);
    return () => ws.current?.close();
  }, [selectedSoulmate]);

  // Websocket sending

  const throttleSend = _.throttle((pixels) => {
    if (!ws.current) return;
    if (ws.current.readyState !== WebSocket.OPEN) return;

    let d = new Uint8Array(pixels.length * 4);

    for (let i = 0; i < pixels.length; i += 1) {
      const index = i * 4;
      const pixel = pixels[i];
      d[index] = i == 0 ? 1 : 0;
      d[index + 1] = pixel.r;
      d[index + 2] = pixel.g;
      d[index + 3] = pixel.b;
    }

    try {
      ws.current.send(d);
    } catch (error) {
      // nothin'
    }
  }, 1000 / 30);

  // Worker callback

  const workerMessage = (e) => {
    if (paused) return;
    setHasPixels(true);

    if (e.data.pixels && canvas.current) {
      drawPixels(
        e.data.pixels,
        canvas.current,
        rows,
        cols,
        serpentine,
        coordinates
      );
    }

    throttleSend(e.data.pixels);

    if (e.data.serialOutput) {
      setSerialOutput(serialOutput + e.data.serialOutput);
      serialOutputRef.current += e.data.serialOutput;
    }
  };

  // Worker control

  const start = () => {
    if (paused) return;
    if (!build) return;

    const { hex } = build;

    if (!worker) {
      worker = new Worker("./worker.js");
      worker.addEventListener("message", workerMessage);
      worker.postMessage({ hex: hex, rows, cols });
    } else {
      worker.postMessage({ paused: false, hex: hex, rows, cols });
    }

    setSerialOutput("");
  };

  const stop = () => {
    setHasPixels(false);
    worker?.terminate();
    worker = undefined;
  };

  // Lifecycle things

  useEffect(() => {
    start();
    return stop;
  }, [build, rows, cols]);

  useEffect(() => {
    if (!paused) {
      start();
    } else {
      worker?.postMessage({ paused: true });
      serialOutputRef.current = "";
    }
  }, [paused]);

  // Auto scrolling compiler output

  useEffect(() => {
    const ref = compilerOutputDiv.current;
    if (ref) ref.scrollTop = ref.scrollHeight;
  }, [serialOutput]);

  // Calculate canvas width and height from rows / cols

  let { width, height } = useCallback(calculateDimensions(rows, cols), [
    rows,
    cols,
  ]);

  // TODO: Turn this into a config variable I think
  return (
    <div
      className={`${className} relative flex flex-grow flex-shrink min-h-0`}
      style={{ ...style, maxWidth, minWidth }}
    >
      <span className="absolute inline-flex justify-end rounded-md top-4 right-4 space-x-2 left-4">
        {!selectedSoulmate && !hideResolutionMenu && (
          <ResolutionPopup
            className="mr-auto"
            cols={cols}
            onChange={({ rows, cols }) => {
              setSavedConfig({ rows, cols });
            }}
            rows={rows}
          />
        )}

        <SoulmatesMenu
          align="end"
          allowUsb={false}
          button={
            <button
              aria-expanded="true"
              aria-haspopup="true"
              className={classnames(
                "inline-flex items-center justify-center w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 space-x-2"
              )}
              id="options-menu"
              type="button"
            >
              <FiCast className="w-4 h-4" />
              {isStreamingSoulmate && (
                <span className="text-xs">
                  {soulmateName(selectedSoulmate)}
                </span>
              )}
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  fillRule="evenodd"
                />
              </svg>
            </button>
          }
          buttonClassName=""
          direction="bottom"
        />
        <button
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 eading-4 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue ctive:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
          onClick={() => setPaused(!paused)}
          type="button"
        >
          {paused ? <BsPlayFill /> : <BsFillPauseFill />}
        </button>
      </span>
      <div className="flex items-center justify-center flex-grow p-10">
        <div
          className="flex items-center justify-center overflow-hidden bg-black border-2 border-white rounded-lg shadow-lg dark-mode:border-gray-600"
          style={{ height, width }}
        >
          {!hasPixels ? (
            <Logo
              className="w-8 duration-2000 animate-spin-slow"
              style={{ animationDuration: "2s" }}
            />
          ) : (
            <canvas height={height} ref={canvas} width={width} />
          )}
        </div>
      </div>

      {serialOutput && (
        <pre
          className="absolute bottom-0 left-0 right-0 p-4 overflow-scroll text-xs text-white break-all bg-gray-800 max-h-40"
          ref={compilerOutputDiv}
          style={{ fontSize: 10 }}
        >
          {serialOutputRef.current}
        </pre>
      )}
    </div>
  );
};

export default Simulator;
