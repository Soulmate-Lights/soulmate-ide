import React, { useEffect, useRef } from "react";
import { AVRRunner } from "./compiler/execute";
import { WS2812Controller } from "./compiler/ws2812";

const Simulator = ({ build, building, rows, cols, height, width }) => {
  const canvas = useRef();
  const runner = useRef();

  const drawPixels = (pixels) => {
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
    runner.current = new AVRRunner(build.hex);
    const matrixController = new WS2812Controller(cols * rows);

    const MHZ = 16000000;
    const cpuNanos = () =>
      Math.round((runner.current.cpu.cycles / MHZ) * 1000000000);

    // Hook to PORTB register
    runner.current.portB.addListener(() =>
      matrixController.feedValue(runner.current.portB.pinState(6), cpuNanos())
    );

    runner.current.execute((cpu) => {
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

    return () => runner.current.stop();
  }, []);

  return (
    <div className="canvas-wrapper">
      <canvas
        width={width}
        height={height}
        style={{ width, height }}
        ref={canvas}
      />
    </div>
  );
};

export default Simulator;
