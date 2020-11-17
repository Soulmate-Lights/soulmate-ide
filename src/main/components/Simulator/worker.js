import "regenerator-runtime/runtime";

import Arduino from "./new-compiler/arduino";

let arduino = new Arduino();

self.addEventListener("message", (e) => {
  const { hex, rows, cols } = e.data;

  if (e.data.paused == true) {
    arduino.stop();
  } else if (e.data.paused == false) {
    arduino.start();
  }

  if (hex) {
    arduino.rows = rows;
    arduino.cols = cols;
    arduino.pixelsCallback = (pixels) => self.postMessage({ pixels });
    arduino.serialCallback = (serialOutput) =>
      self.postMessage({ serialOutput });
    arduino.hex = hex;
  }
});
