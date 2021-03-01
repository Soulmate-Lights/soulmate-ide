import { dataPin } from "@elliottkember/leduino";

import renameDefines from "~/utils/replaceDefines";

const translation = `
CRGB* leds = Soulmate.leds;
#define NUM_LEDS N_LEDS
#define ROWS LED_ROWS
#define COLS LED_COLS
`;

export const preparePreviewCode = (code, config) => {
  const { rows, cols, serpentine } = config;

  return `#define FASTLED_INTERNAL
#include "FastLED.h"

// LEDs pin
#define DATA_PIN ${dataPin}

// Matrix size
#define LED_ROWS ${rows}
#define LED_COLS ${cols}
#define N_LEDS (LED_ROWS * LED_COLS)
#define N_CELLS N_LEDS

class FakeSoulmate {
  public:
  // Define the array of leds
  CRGB leds[N_LEDS];
};

#define SOULMATE_SERPENTINE ${serpentine ? "true" : "false"}

FakeSoulmate Soulmate;

${translation}

int16_t gridIndexHorizontal(int16_t x, int16_t y) {
  if (y > LED_ROWS) return -1;
  if (x > LED_COLS) return -1;
  if (x < 0) return -1;
  if (y < 0) return -1;

  int16_t xIndex = x;

  // Serpentine row
  if (SOULMATE_SERPENTINE && y % 2 != 1) {
    xIndex = LED_COLS - 1 - xIndex;
  }

  int16_t index = y * LED_COLS + xIndex;

  if (index > -1 && index < N_LEDS) {
    return index;
  }
  return -1;
}

uint16_t XY(uint8_t x, uint8_t y) {
  return gridIndexHorizontal(x, y);
}

void setup() {
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(Soulmate.leds, N_LEDS);
  FastLED.setBrightness(255);
  Serial.begin(9600);
}

namespace Pattern {
  ${renameDefines(code)}
}

void loop() {
  Pattern::draw();
  FastLED.show();
}
`.trim();
};

export const prepareSketches = (sketches, config) => {
  const {
    rows,
    cols,
    ledType,
    milliamps,
    button,
    data,
    clock,
    serpentine,
    reverse,
    mirror,
  } = config;

  if (!rows) throw "Number of rows wasn't set";
  if (!cols) throw "Number of columns wasn't set";
  if (!milliamps) throw "Milliamps wasn't set";
  if (!milliamps) throw "Milliamps wasn't set";

  const sanitizedSketchName = (name) => name.replace(/"/g, "");

  const code = sketches
    .map(
      ({ code }, index) =>
        `namespace Pattern${index} {
          ${renameDefines(code)}
        }`
    )
    .join("\n");

  const initialization = sketches
    .map(
      ({ name }, index) =>
        `Soulmate.addRoutine("${sanitizedSketchName(
          name
        )}", Pattern${index}::draw);`
    )
    .join("\n");

  return `
// Don't forget to change this!
#define FIRMWARE_NAME "soulmate-custom"
// The number of LEDs in each parallel strip
#define LED_COLS ${cols}
// The number of parallel strips
#define LED_ROWS ${rows}
// Normally LED_COLS * LED_ROWS
// #define N_LEDS ${cols * rows}

#define SOULMATE_REVERSE ${reverse ? "true" : "false"}
#define SOULMATE_MIRROR ${mirror ? "true" : "false"}

// How long should we spend in each pattern?
#define CYCLE_LENGTH_IN_MS 120000
// How long should the Soulmate fade between patterns?
#define FADE_DURATION 3000
// Total power in milliamps
#define SOULMATE_MILLIAMPS ${milliamps}

${ledType === "WS2812B" ? `#define USE_WS2812B true` : ""}
${ledType === "WS2812B" ? "#define SOULMATE_COLOR_ORDER GRB" : ""}

${
  button
    ? `#define BUTTON_ON_VALUE LOW
  #define SOULMATE_BUTTON_PIN ${button}`
    : ""
}
#define SOULMATE_DATA_PIN ${data}

${clock ? `#define SOULMATE_CLOCK_PIN ${clock}` : ""}
#define SOULMATE_LED_TYPE ${ledType}

#define SOULMATE_SERPENTINE ${serpentine ? "true" : "false"}

#include "Soulmate.h"

#ifndef random
int random() {
  return random(255);
}
#endif

${translation}

${code}

void setup() {
  ${initialization}
  Soulmate.setup();
}

void loop() {
  Soulmate.loop();
}`;
};

export const emptyCode = `void draw() {
  // Your pattern code goes here.
  // This draw() function is called repeatedly and the LEDs will be
  // printed after every loop.
  //
  // Some helpful variables:
  // ROWS: number of rows
  // COLS: number of columns
  // N_LEDS: total number of LEDs (LED_COLS * LED_ROWS)
  // leds: the LED array to print to
  //
  // You can also use:
  // uint16_t gridIndexHorizontal(x, y) - the index of a given x/y coordinate
  // uint8_t beatsin8(bpm, minimum, maximum, offset) - an 8-bit sine wave
  //
  // For more information, visit https://github.com/FastLED/FastLED/wiki/Overview
}`;

import streamWithProgress from "~/utils/streamWithProgress";

const options = {
  method: "POST",
  mode: "cors",
  credentials: "same-origin",
  cache: "no-cache",
  headers: {
    "Content-Type": "application/json",
  },
};

export async function buildHex(code, config, url) {
  const source = preparePreviewCode(code, config);
  const body = JSON.stringify({ sketch: source, board: "mega" });
  const resp = await fetch(url, {
    ...options,
    body,
    Authority: "hexi.wokwi.com",
    "X-Override-Ip": "129.42.208.183",
    referer: "https://avr8js-mega-ws2812.stackblitz.io/",
  });
  return await resp.json();
}

export async function getFullBuildAsBlob(source, firmwareUrl) {
  const body = JSON.stringify({ sketch: source });
  console.log("[getFullBuildAsBlob]", { body });
  const res = await window.fetch(firmwareUrl, {
    ...options,
    body,
  });

  console.log("[getFullBuildAsBlob]", { res });

  if (!res.ok) {
    const result = await res.text();
    throw result;
  }

  return await res.blob();
}

export async function getFullBuild(source, firmwareUrl) {
  const body = JSON.stringify({ sketch: source });
  console.log("[getFullBuild]", { body });
  const res = await window.fetch(firmwareUrl, {
    ...options,
    body,
  });

  console.log("[getFullBuild]", { res });

  if (!res.ok) {
    const result = await res.text();
    throw result;
  }

  const path = electron.remote.app.getPath("temp");
  const filename = parseInt(Math.random() * 10000000);
  const filePath = `${path}${filename}.bin`;
  console.log("[getFullBuild]", { filePath });
  const writer = fs.createWriteStream(filePath);
  console.log("[getFullBuild]", { writer });
  const reader = res.body.getReader();
  const finalLength =
    length || parseInt(res.headers.get("Content-Length" || "0"), 10);
  console.log("[getFullBuild]", { finalLength });

  try {
    await streamWithProgress(finalLength, reader, writer, () => {});
  } catch (e) {
    console.log("[getFullBuild] Error: streamWithProgress failed", e);
  }

  console.log(`[getFullBuild] Written to ${filePath}`);

  return filePath;
}

// TODO: Move this into a util function
export const getSoulmateBuild = async (sketches, config) => {
  const preparedCode = prepareSketches(sketches, config);
  const build = await getFullBuild(preparedCode);

  return build;
};
