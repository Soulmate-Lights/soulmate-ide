import { BsFillPauseFill, BsPlayFill } from "react-icons/bs";

import Logo from "~/images/logo.svg";
require("./simulator.css");

let worker;

const cleanError = (error) =>
  error
    .replace(/\/home\/ec2-user\/wokwi-hexi\/\/sketch\/sketch\.ino:/g, "")
    .replace(/ In function 'void Pattern::draw\(\)':\n/g, "")
    .replace(/Error during build: exit status 1/g, "");

const Simulator = ({ build, rows, cols, height, width }) => {
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

  return (
    <div className="simulator">
      <div onClick={() => setPaused(!paused)} className="pause button">
        {paused ? <BsPlayFill /> : <BsFillPauseFill />}
      </div>

      {!build && (
        <div
          style={{
            width: cols * 10,
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Logo className="loader" />
        </div>
      )}

      {build && (
        <div className="canvas-wrapper">
          <canvas
            width={width}
            height={height}
            style={{ width, height }}
            ref={canvas}
          />
        </div>
      )}

      {serialOutput && (
        <div className="serial-output" ref={compilerOutputDiv}>
          <pre className="serial-output-text">{serialOutputRef.current}</pre>
        </div>
      )}

      {build?.stderr && (
        <div className="compiler-output">
          <pre className="compiler-output-text">{cleanError(build.stderr)}</pre>
        </div>
      )}
    </div>
  );
};

export default Simulator;
