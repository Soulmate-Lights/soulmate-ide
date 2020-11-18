import "regenerator-runtime/runtime";

import LEDuino from "@elliottkember/leduino";

let arduino;

self.addEventListener("message", (e) => {
  const { hex, rows, cols } = e.data;

  if (e.data.paused == true) {
    arduino?.stop();
  } else if (e.data.paused == false) {
    arduino?.start();
  }

  if (hex) {
    arduino = new LEDuino({
      rows,
      cols,
      serpentine: true,
      hex: hex,
      // canvas: canvas,
      onPixels: (pixels) => self.postMessage({ pixels }),
      onSerial: (serialOutput) => self.postMessage({ serialOutput }),
    });
  }
});
