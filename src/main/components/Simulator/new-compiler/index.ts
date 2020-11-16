import "@wokwi/elements";
import { buildHex } from "./compile";
import { AVRRunner } from "./execute";
import { formatTime } from "./format-time";
import { NeopixelMatrixElement } from "@wokwi/elements";
import { WS2812Controller } from "./ws2812";
import "./index.css";

const BLINK_CODE = `
#include "FastLED.h"

// Matrix size
#define NUM_ROWS 9
#define NUM_COLS 9

// LEDs pin
#define DATA_PIN 3

// LED brightness
#define BRIGHTNESS 180

#define NUM_LEDS NUM_ROWS * NUM_COLS

// Define the array of leds
CRGB leds[NUM_LEDS];

void setup() {
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(leds, NUM_LEDS);
  FastLED.setBrightness(BRIGHTNESS);
}

int counter = 0;
void loop() {
  for (byte row = 0; row < NUM_ROWS; row++) {
    for (byte col = 0; col < NUM_COLS; col++) {
      int delta = abs(NUM_ROWS - row * 2) + abs(NUM_COLS - col * 2);
      leds[row * NUM_COLS + col] = CHSV(delta * 4 + counter, 255, 255);
    }
  }
  FastLED.show();
  delay(5);
  counter++;
}
`.trim();

let editor;
declare const window: any;
declare const monaco: any;
window.editorLoaded = () => {
  window.require.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.20.0/min/vs",
    },
  });
  window.require(["vs/editor/editor.main"], () => {
    editor = monaco.editor.create(document.querySelector(".code-editor"), {
      value: BLINK_CODE,
      language: "cpp",
      minimap: { enabled: false },
    });
  });
};

// Set up the NeoPixel matrix
const matrix = document.querySelector<NeopixelMatrixElement & HTMLElement>(
  "wokwi-neopixel-matrix"
);

// Set up toolbar
let runner: AVRRunner;

const runButton = document.querySelector("#run-button");
runButton.addEventListener("click", compileAndRun);
const stopButton = document.querySelector("#stop-button");
stopButton.addEventListener("click", stopCode);
const statusLabel = document.querySelector("#status-label");
const compilerOutputText = document.querySelector("#compiler-output-text");

function executeProgram(hex: string) {
  runner = new AVRRunner(hex);
  const MHZ = 16000000;

  const cpuNanos = () => Math.round((runner.cpu.cycles / MHZ) * 1000000000);
  const matrixController = new WS2812Controller(matrix.cols * matrix.rows);

  // Hook to PORTD register
  runner.portD.addListener(() => {
    matrixController.feedValue(runner.portD.pinState(3), cpuNanos());
  });
  runner.execute((cpu) => {
    const time = formatTime(cpu.cycles / MHZ);
    statusLabel.textContent = "Simulation time: " + time;
    const pixels = matrixController.update(cpuNanos());
    if (pixels) {
      for (let row = 0; row < matrix.rows; row++) {
        for (let col = 0; col < matrix.cols; col++) {
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

async function compileAndRun() {
  runButton.setAttribute("disabled", "1");
  try {
    statusLabel.textContent = "Compiling...";
    const result = await buildHex(editor.getModel().getValue());
    compilerOutputText.textContent = result.stderr || result.stdout;
    if (result.hex) {
      compilerOutputText.textContent += "\nProgram running...";
      stopButton.removeAttribute("disabled");
      executeProgram(result.hex);
    } else {
      runButton.removeAttribute("disabled");
    }
  } catch (err) {
    runButton.removeAttribute("disabled");
    alert("Failed: " + err);
  } finally {
    statusLabel.textContent = "";
  }
}

function stopCode() {
  stopButton.setAttribute("disabled", "1");
  runButton.removeAttribute("disabled");
  if (runner) {
    runner.stop();
    runner = null;
  }
}
