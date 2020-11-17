import "regenerator-runtime/runtime";

import Arduino from "./new-compiler/arduino";

let arduino = new Arduino();

self.addEventListener("message", (e) => {
  const { build, rows, cols } = e.data;

  if (e.data.stop) {
    console.log("Stopping");
    arduino.stop();
  } else {
    if (build) {
      start({ build, rows, cols });
    }
  }
});

const start = ({ build, rows, cols }) => {
  if (!build.hex) {
    return;
  }

  arduino.rows = rows;
  arduino.cols = cols;

  arduino.pixelsCallback = (pixels) => self.postMessage({ pixels });
  arduino.serialCallback = (serialOutput) => self.postMessage({ serialOutput });

  arduino.hex = build.hex;
};
