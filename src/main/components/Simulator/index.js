import { drawPixels } from "@elliottkember/leduino";
import { BsFillPauseFill } from "@react-icons/all-files/bs/BsFillPauseFill";
import { BsPlayFill } from "@react-icons/all-files/bs/BsPlayFill";
import { FiCast } from "@react-icons/all-files/fi/FiCast";
import useEventListener from "@use-it/event-listener";
import _ from "lodash";
import { useCallback } from "react";

import SoulmatesMenu from "~/components/SoulmatesMenu";
import SoulmatesContainer from "~/containers/soulmates";
import Logo from "~/images/logo.svg";
import soulmateName from "~/utils/soulmateName";

import ResolutionPopup from "./resolutionPopup";
import { calculateDimensions, useWindowSize } from "./utils";

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
  const worker = useRef();

  const { selectedSoulmate, setSavedConfig } =
    SoulmatesContainer.useContainer();

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
      drawPixels(e.data.pixels, canvas.current, rows, cols, serpentine);
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

    if (!worker.current) {
      worker.current = new Worker(new URL("./worker", import.meta.url));
      worker.current.addEventListener("message", workerMessage);
      worker.current.postMessage({ hex: hex, rows, cols });
    } else {
      worker.current.postMessage({ paused: false, hex: hex, rows, cols });
    }

    setSerialOutput("");
  };

  const stop = () => {
    setHasPixels(false);
    worker.current?.terminate();
    worker.current = undefined;
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
      worker.current?.postMessage({ paused: true });
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

  const windowSize = useWindowSize();
  if (width > windowSize.width * 0.5) {
    width *= 0.5;
    height *= 0.5;
  }

  // Event listeners

  let stopResizeTimeout = useRef();
  useEventListener("resize", () => {
    setPaused(true);
    clearTimeout(stopResizeTimeout.current);
    stopResizeTimeout.current = setTimeout(() => setPaused(false), 500);
  });

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
              setSavedConfig({ ...config, rows, cols });
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
          className="flex items-center justify-center flex-shrink-0 overflow-hidden bg-black border-2 border-white rounded-lg shadow-lg dark-mode:border-gray-600"
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
