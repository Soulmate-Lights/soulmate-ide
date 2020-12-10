import useEventListener from "@use-it/event-listener";
import _ from "lodash";
import { useCallback } from "react";
import { BsFillPauseFill, BsPlayFill } from "react-icons/bs";
import { FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

import Logo from "~/images/logo.svg";

let worker;
import { drawPixels } from "@elliottkember/leduino";

import { calculateDimensions } from "./utils";

const Simulator = ({
  build,
  config: { rows, cols, serpentine, mirror },
  showConfig = true,
  className,
  minWidth,
  maxWidth,
  style,
}) => {
  const canvas = useRef();
  const compilerOutputDiv = useRef();
  const [serialOutput, setSerialOutput] = useState("");
  const serialOutputRef = useRef("");
  const [hasPixels, setHasPixels] = useState(false);
  const [paused, setPaused] = useState(!document.hasFocus());

  const ws = useRef();

  useEffect(() => {
    ws.current = new WebSocket("ws://10.0.1.16:81");
    return () => ws.current?.close()
  }, []);

  // Worker callback

  const throttleSend = _.throttle((pixels) => {
    if (ws.current.readyState !== WebSocket.OPEN) return;

    let d = new Uint8Array(pixels.length * 3);
    for (let i = 0; i < pixels.length; i += 1) {
      const index = i * 3;
      const pixel = pixels[i];
      d[index] = pixel.r;
      d[index + 1] = pixel.g;
      d[index + 2] = pixel.b;
    }
    try {
      ws.current.send(d);
    } catch (error) {
      // nothin'
    }
  }, 20);

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

  useEffect(() => {
    const ref = compilerOutputDiv.current;
    if (ref) ref.scrollTop = ref.scrollHeight;
  }, [serialOutput]);

  // Event listeners

  let stopResizeTimeout = useRef();
  useEventListener("resize", () => {
    setPaused(true);
    clearTimeout(stopResizeTimeout.current);
    stopResizeTimeout.current = setTimeout(() => setPaused(false), 500);
  });

  // useEventListener("blur", () => setPaused(true));
  // useEventListener("focus", () => setPaused(false));

  // Calculate canvas width and height from rows / cols

  const { width, height } = useCallback(calculateDimensions(rows, cols), [
    rows,
    cols,
  ]);

  return (
    <div
      className={`${className} relative flex flex-grow flex-shrink min-h-0 overflow-auto`}
      style={{ ...style, maxWidth, minWidth }}
    >
      <span className="absolute inline-flex rounded-md top-4 right-4 space-x-2">
        {showConfig && (
          <Link
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-4 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
            onClick={() => setPaused(!paused)}
            to="/config"
          >
            {<FaCog />}
          </Link>
        )}
        <button
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-4 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
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
            <canvas
              height={height}
              ref={canvas}
              style={mirror ? { transform: "scaleX(-1)" } : {}}
              width={width}
            />
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
