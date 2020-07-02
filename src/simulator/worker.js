import "regenerator-runtime/runtime";

import { AVRRunner } from "./compiler/execute";
import { WS2812Controller } from "./compiler/ws2812";

let runner;

self.addEventListener("message", (e) => {
  const { build, rows, cols } = e.data;
  if (build) start({ build, rows, cols });
});

const start = ({ build, rows, cols }) => {
  if (runner) runner.stop();
  runner = new AVRRunner(build.hex);
  const matrixController = new WS2812Controller(cols * rows);

  const MHZ = 16000000;
  const cpuNanos = () => Math.round((runner.cpu.cycles / MHZ) * 1000000000);

  runner.portB.addListener(() =>
    matrixController.feedValue(runner.portB.pinState(6), cpuNanos())
  );

  runner.usart.onByteTransmit = (value) => {
    const serialOutput = String.fromCharCode(value);
    self.postMessage({ serialOutput });
  };

  runner.execute((_cpu) => {
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

    self.postMessage({ pixels: pixelsToDraw });
  });
};
