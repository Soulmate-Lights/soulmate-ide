import { AVRRunner } from "./execute";
import { WS2812Controller } from "./ws2812";
const MHZ = 16000000;

export default class Arduino {
  pixelsCallback = () => console.log("Pixels callback not set");
  serialCallback = () => console.log("Serial callback not set");

  cpuNanos = () => Math.round((this.runner.cpu.cycles / MHZ) * 1000000000);

  listener = () => {
    this.matrixController.feedValue(
      this.runner.portB.pinState(6),
      this.cpuNanos()
    );
  };

  set hex(newHex) {
    if (newHex === this._hex) return;

    this.runner?.portB.removeListener(this.listener);
    this.runner?.stop();

    this._hex = newHex;
    this.runner = new AVRRunner(this._hex);
    this.matrixController = new WS2812Controller(this.cols * this.rows);

    this.runner.portB.addListener(this.listener);

    this.runner.usart.onByteTransmit = (value) =>
      this.serialCallback(String.fromCharCode(value));

    this.start();
  }

  stop = () => {
    this.runner?.stop();
  };

  start = () => {
    this.runner?.execute((_cpu) => {
      const pixels = this.matrixController.update(this.cpuNanos());

      if (!pixels) return;
      const pixelsToDraw = [];

      for (let row = 0; row < this.rows; row++) {
        for (let col = 0; col < this.cols; col++) {
          let value = pixels[row * this.cols + col];

          pixelsToDraw.push({
            y: row,
            x: row % 2 ? this.cols - col - 1 : col,
            b: value & 0xff,
            r: (value >> 8) & 0xff,
            g: (value >> 16) & 0xff,
          });
        }
      }

      this.pixelsCallback(pixelsToDraw);
    });
  };
}
