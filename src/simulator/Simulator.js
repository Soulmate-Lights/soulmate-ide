import React, { useEffect, useRef, useState } from "react";
import Logo from "./logo.svg";
import { AVRRunner } from "./compiler/execute";
import { WS2812Controller } from "./compiler/ws2812";

const Simulator = ({ build, rows, cols, height, width }) => {
  const canvas = useRef();
  const runner = useRef();
  const compilerOutputDiv = useRef();
  const [serialOutput, setSerialOutput] = useState("");

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

  let text = "";

  const addSerialOutput = (value) => {
    text += value;
    setSerialOutput(text);
  };

  useEffect(() => {
    if (compilerOutputDiv.current) {
      compilerOutputDiv.current.scrollTop =
        compilerOutputDiv.current.scrollHeight;
    }
  }, [serialOutput]);

  useEffect(() => {
    setSerialOutput("");
    if (!build) return;
    runner.current = new AVRRunner(build.hex);
    const matrixController = new WS2812Controller(cols * rows);

    const MHZ = 16000000;
    const cpuNanos = () =>
      Math.round((runner.current.cpu.cycles / MHZ) * 1000000000);

    runner.current.portB.addListener(() =>
      matrixController.feedValue(runner.current.portB.pinState(6), cpuNanos())
    );

    runner.current.usart.onByteTransmit = (value) => {
      addSerialOutput(String.fromCharCode(value));
    };

    runner.current.execute((_cpu) => {
      const pixels = matrixController.update(cpuNanos());

      if (!pixels) return;
      const pixelsToDraw = [];

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          let value = pixels[row * cols + col];

          pixelsToDraw.push({
            y: row,
            x: row % 2 ? cols - col - 1 : col,
            b: value & 0xff,
            r: (value >> 8) & 0xff,
            g: (value >> 16) & 0xff,
          });
        }
      }

      drawPixels(pixelsToDraw);
    });

    return () => {
      runner.current.stop();
      runner.current = null;
    };
  }, [build]);

  window.stderr = build?.stderr;

  return (
    <div className="simulator">
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
          <pre className="serial-output-text">{serialOutput}</pre>
        </div>
      )}
      {build?.stderr && (
        <div className="compiler-output">
          <pre className="compiler-output-text">
            {build.stderr
              .replace(
                /\/home\/ec2-user\/wokwi-hexi\/\/sketch\/sketch\.ino:/g,
                ""
              )
              .replace(/ In function 'void Pattern::draw\(\)':\n/g, "")
              .replace(/Error during build: exit status 1/g, "")}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Simulator;
