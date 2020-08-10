import { BsFillPauseFill, BsPlayFill } from "react-icons/bs";

import Logo from "~/images/logo.svg";

// require("./simulator.css");

let worker;

const cleanError = (error) =>
  error
    .replace(/\/home\/ec2-user\/wokwi-hexi\/\/sketch\/sketch\.ino:/g, "")
    .replace(/ In function 'void Pattern::draw\(\)':\n/g, "")
    .replace(/Error during build: exit status 1/g, "");

const Simulator = ({ build, rows, cols, className = "", style }) => {
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
      const x = (cols - 1) * pixelWidth - pixel.x * pixelWidth;
      const y = (rows - 1) * pixelHeight - pixel.y * pixelHeight;

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

  useEffect(() => {
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

  if (width < 250) {
    let ratio = width / height;
    width = 250;
    height = width * ratio;
  }

  if (width > 240) {
    let ratio = width / height;
    width = 240;
    height = width * ratio;
  }

  return (
    <div
      style={{ ...style, maxWidth: 300, minWidth: 300 }}
      className={`${className} relative flex flex-grow flex-shrink min-h-0 overflow-auto`}
    >
      {build ? (
        <>
          <span className="inline-flex rounded-md shadow-sm top-4 right-4 absolute">
            <button
              onClick={() => setPaused(!paused)}
              type="button"
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150"
            >
              {paused ? <BsPlayFill /> : <BsFillPauseFill />}
            </button>
          </span>
          <div className="flex justify-center items-center p-10 flex-grow">
            <canvas
              width={width}
              height={height}
              ref={canvas}
              className="bg-black"
            />
          </div>
          {serialOutput && (
            <div className="serial-output" ref={compilerOutputDiv}>
              <pre className="serial-output-text">
                {serialOutputRef.current}
              </pre>
            </div>
          )}
          {build?.stderr && (
            <div className="compiler-output">
              <pre className="compiler-output-text">
                {cleanError(build.stderr)}
              </pre>
            </div>
          )}
        </>
      ) : (
        <div className="justify-center items-center flex flex-grow">
          <Logo
            className="animate-spin duration-2000 /animate-spin-slow w-8"
            style={{ animationDuration: "2s" }}
          />
        </div>
      )}
    </div>
  );
};

export default Simulator;
