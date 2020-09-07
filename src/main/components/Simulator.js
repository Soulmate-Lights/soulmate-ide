import { BsFillPauseFill, BsPlayFill } from "react-icons/bs";
import { FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

import Logo from "~/images/logo.svg";

let worker;

const Simulator = ({ className = "", build, config, maxWidth, minWidth }) => {
  const { rows, cols, style, serpentine } = config;
  const [paused, setPaused] = useState(!document.hasFocus());
  const canvas = useRef();
  const compilerOutputDiv = useRef();
  const [serialOutput, setSerialOutput] = useState("");
  const serialOutputRef = useRef("");

  const drawPixels = (pixels) => {
    if (!canvas.current) return;
    var ctx = canvas.current.getContext("2d");
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);

    const pixelWidth = canvas.current.width / cols;
    const pixelHeight = canvas.current.height / rows;

    for (let pixel of pixels) {
      let x;
      let y;

      if (!serpentine) {
        if (pixel.y % 2 == 1) {
          x = pixel.x * pixelWidth;
        } else {
          x = (cols - 1) * pixelWidth - pixel.x * pixelWidth;
        }
        y = (rows - 1) * pixelHeight - pixel.y * pixelHeight;
      } else {
        x = (cols - 1) * pixelWidth - pixel.x * pixelWidth;
        y = (rows - 1) * pixelHeight - pixel.y * pixelHeight;
      }

      ctx.beginPath();
      ctx.rect(x, y, pixelWidth, pixelHeight);
      ctx.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
      ctx.shadowColor = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
      ctx.fill();
    }
  };

  useEffect(() => {
    if (!paused) start();
    return stop;
  }, [paused, build]);

  let stopResizeTimeout;

  useEffect(() => {
    window.addEventListener("resize", () => {
      clearTimeout(stopResizeTimeout);
      stopResizeTimeout = setTimeout(() => {
        setPaused(false);
      }, 400);
    });
    window.addEventListener("blur", () => setPaused(true));
    window.addEventListener("focus", () => setPaused(false));
  }, []);

  const stop = () => {
    worker?.terminate();
    serialOutputRef.current = "";
  };

  const workerMessage = (e) => {
    if (e.data.pixels) {
      drawPixels(e.data.pixels);
    }

    if (e.data.serialOutput) {
      setSerialOutput(serialOutput + e.data.serialOutput);
      serialOutputRef.current = serialOutputRef.current + e.data.serialOutput;
    }
  };

  const start = () => {
    worker?.terminate();
    worker = new Worker("./worker.js");
    worker.addEventListener("message", workerMessage);
    worker.postMessage({ build, rows, cols });

    if (!build) return;
    setSerialOutput("");
  };

  useEffect(() => {
    if (compilerOutputDiv.current) {
      compilerOutputDiv.current.scrollTop =
        compilerOutputDiv.current.scrollHeight;
    }
  }, [serialOutput]);

  let width = cols * 10;
  let height = rows * 10;

  if (width < 250 && height < 250) {
    let ratio = width / height;
    width = 250;
    height = width * ratio;
  }

  if (width > 240 && height > 240) {
    let ratio = width / height;
    width = 240;
    height = width * ratio;
  }

  return (
    <div
      className={`${className} relative flex flex-grow flex-shrink min-h-0 overflow-auto`}
      style={{ ...style, maxWidth, minWidth }}
    >
      {build ? (
        <>
          <span className="absolute inline-flex rounded-md shadow-sm top-4 right-4 space-x-2">
            <Link
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 leading-4 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
              onClick={() => setPaused(!paused)}
              to="/config"
            >
              {<FaCog />}
            </Link>
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
      ) : (
        <div className="flex items-center justify-center flex-grow">
          <Logo
            className="w-8 animate-spin duration-2000 /animate-spin-slow"
            style={{ animationDuration: "2s" }}
          />
        </div>
      )}
    </div>
  );
};

export default Simulator;
