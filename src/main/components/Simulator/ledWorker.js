import "regenerator-runtime/runtime";

import LEDuino from "@elliottkember/leduino";

let arduino;
let _hex;

self.addEventListener("message", (e) => {
  const { hex, rows, cols } = e.data;

  if (e.data.paused == true) {
    arduino?.stop();
  } else if (e.data.paused == false) {
    arduino?.start();
  }

  if (hex && hex !== _hex) {
    _hex = hex;
    arduino?.stop();
    arduino = new LEDuino({
      rows,
      cols,
      serpentine: true,
      hex: hex,
      onPixels: (pixels) => self.postMessage({ pixels }),
      onSerial: (serialOutput) => self.postMessage({ serialOutput }),
    });
  }
});
