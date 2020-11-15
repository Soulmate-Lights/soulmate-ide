import "regenerator-runtime/runtime";

import "@wokwi/elements";
import { AVRRunner } from "./execute";
import { NeopixelMatrixElement } from "@wokwi/elements";
import { WS2812Controller } from "./ws2812";

// Set up the NeoPixel matrix
const matrix = document.querySelector<NeopixelMatrixElement & HTMLElement>(
  "wokwi-neopixel-matrix"
);

let runner: AVRRunner;

function executeProgram(hex: string) {
  runner = new AVRRunner(hex);
  const MHZ = 16000000;

  const cols = 9;
  const rows = 9;

  const cpuNanos = () => Math.round((runner.cpu.cycles / MHZ) * 1000000000);
  const matrixController = new WS2812Controller(cols * rows);
  runner.portD.addListener(() => {
    matrixController.feedValue(runner.portD.pinState(3), cpuNanos());
  });
  runner.execute((cpu) => {
    const pixels = matrixController.update(cpuNanos());
    if (pixels) {
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const value = pixels[row * matrix.cols + col];
          matrix.setPixel(row, col, {
            b: (value & 0xff) / 255,
            r: ((value >> 8) & 0xff) / 255,
            g: ((value >> 16) & 0xff) / 255,
          });
        }
      }
    }
  });
}

import hex from "./hex";
setTimeout(() => {
  executeProgram(hex);
}, 10);
