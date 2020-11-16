import useEventListener from "@use-it/event-listener";
import { useCallback } from "react";
import { BsFillPauseFill, BsPlayFill } from "react-icons/bs";
import { FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

import Logo from "~/images/logo.svg";

let worker;
import { calculateDimensions, drawPixels } from "./utils";

const Simulator = ({
  build,
  config: { rows, cols, serpentine },
  showConfig = true,
}) => {
  const canvas = useRef();
  const compilerOutputDiv = useRef();
  const [serialOutput, setSerialOutput] = useState("");
  const serialOutputRef = useRef("");

  // Worker callback

  const workerMessage = (e) => {
    if (e.data.pixels && canvas.current)
      drawPixels(e.data.pixels, canvas.current, rows, cols, serpentine);

    if (e.data.serialOutput) {
      setSerialOutput(serialOutput + e.data.serialOutput);
      serialOutputRef.current += e.data.serialOutput;
    }
  };

  // Worker control

  const start = () => {
    worker?.terminate();
    worker = new Worker("./worker.js");
    worker.addEventListener("message", workerMessage);
    worker.postMessage({ build, rows, cols });

    if (!build) return;
    setSerialOutput("");
  };

  const stop = () => {
    worker?.terminate();
    serialOutputRef.current = "";
  };

  // Lifecycle things

  const [paused, setPaused] = useState(!document.hasFocus());
  useEffect(() => {
    if (!paused) start();
    return stop;
  }, [paused, build]);

  let stopResizeTimeout;

  useEventListener("resize", () => {
    clearTimeout(stopResizeTimeout);
    stopResizeTimeout = setTimeout(() => {
      setPaused(false);
    }, 400);
  });

  useEventListener("blur", () => setPaused(true));
  useEventListener("focus", () => setPaused(false));

  useEffect(() => {
    const ref = compilerOutputDiv.current;
    if (ref) ref.scrollTop = ref.scrollHeight;
  }, [serialOutput]);

  const { width, height } = useCallback(calculateDimensions(rows, cols), [
    rows,
    cols,
  ]);

  return (
    <>
      <span className="absolute inline-flex rounded-md shadow-sm top-4 right-4 space-x-2">
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
        <canvas
          className="bg-black"
          height={height}
          ref={canvas}
          width={width}
        />
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
    </>
  );
};

const WrappedSimulator = ({
  className,
  minWidth,
  maxWidth,
  style,
  ...props
}) => (
  <div
    className={`${className} relative flex flex-grow flex-shrink min-h-0 overflow-auto`}
    style={{ ...style, maxWidth, minWidth }}
  >
    {!props.build ? (
      <div className="flex items-center justify-center flex-grow">
        <Logo
          className="w-8 animate-spin duration-2000 /animate-spin-slow"
          style={{ animationDuration: "2s" }}
        />
      </div>
    ) : (
      <Simulator {...props} />
    )}
  </div>
);

export default WrappedSimulator;
