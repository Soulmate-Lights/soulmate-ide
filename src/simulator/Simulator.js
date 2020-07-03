import Logo from "./logo.svg";
import { BsPlayFill, BsFillPauseFill } from "react-icons/bs";

let worker;

function rgbToHsl(r, g, b) {
  (r /= 255), (g /= 255), (b /= 255);

  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  // return [h, s, l];
  return { h, s, l };
}

function hslToRgb(h, s, l) {
  var r, g, b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // return [r * 255, g * 255, b * 255];
  return { r: r * 255, g: g * 255, b: b * 255 };
}

const cleanError = (error) =>
  error
    .replace(/\/home\/ec2-user\/wokwi-hexi\/\/sketch\/sketch\.ino:/g, "")
    .replace(/ In function 'void Pattern::draw\(\)':\n/g, "")
    .replace(/Error during build: exit status 1/g, "");

const Simulator = ({ build, rows, cols, height, width }) => {
  const [paused, setPaused] = useState(false);

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
      // ctx.globalCompositeOperation = "lighter";

      const hsl = rgbToHsl(pixel.r, pixel.g, pixel.b);
      const rgb = hslToRgb(hsl.h, hsl.s, 1 - hsl.l);
      ctx.fillStyle = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

      // ctx.fillStyle = `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`;
      ctx.fill();
    }
  };

  useEffect(() => {
    if (!paused) start();
    return stop;
  }, [paused, build]);

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
