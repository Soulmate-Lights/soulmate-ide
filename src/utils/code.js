const translation = `
CRGB* leds = Soulmate.leds;
#define NUM_LEDS N_LEDS
#define ROWS LED_ROWS
#define COLS LED_COLS
`;

export const preparePreviewCode = (code, rows, cols) =>
  `#define FASTLED_INTERNAL
#include "FastLED.h"

// LEDs pin
#define DATA_PIN 12

// Matrix size
#define LED_ROWS ${rows}
#define LED_COLS ${cols}
#define N_LEDS LED_ROWS * LED_COLS
#define N_CELLS N_LEDS

class FakeSoulmate {
  public:
  // Define the array of leds
  CRGB leds[N_LEDS];
};

FakeSoulmate Soulmate;

${translation}

int16_t gridIndexHorizontal(int16_t x, int16_t y) {
  if (y > LED_ROWS) return -1;
  if (x > LED_COLS) return -1;
  if (x < 0) return -1;
  if (y < 0) return -1;

  int16_t index = 0;
  if (y % 2 == 1) {
    index = y * LED_COLS + x;
  } else {
    index = y * LED_COLS + LED_COLS - 1 - x;
  }

  if (index > -1 && index < N_LEDS) {
    return index;
  } else {
    return -1;
  }
}

void setup() {
  FastLED.addLeds<NEOPIXEL, DATA_PIN>(Soulmate.leds, N_LEDS);
  FastLED.setBrightness(255);
  Serial.begin(9600);
}

namespace Pattern {
  ${code}
}

void loop() {
  Pattern::draw();
  FastLED.show();
}
`.trim();

export const prepareFullCodeWithMultipleSketches = (
  sketches,
  rows = 70,
  cols = 15,
  chipType = "atom",
  ledType = "APA102",
  milliamps = 700
) => {
  const sanitizedSketchName = (name) => {
    return name.replace(/"/g, "");
  };

  const code = sketches
    .map(
      ({ code }, index) =>
        `namespace Pattern${index} {
      ${code}
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
// #define N_LEDS 1050
// If you're using WS2812B LED strips, uncomment this line

// How long should we spend in each pattern?
#define CYCLE_LENGTH_IN_MS 120000
// How long should the Soulmate fade between patterns?
#define FADE_DURATION 3000
// Total power in milliamps
#define SOULMATE_MILLIAMPS ${milliamps}

${ledType === "WS2812B" ? `#define USE_WS2812B true` : ""}

${
  chipType === "atom"
    ? `
#define BUTTON_ON_VALUE LOW
#define SOULMATE_BUTTON_PIN 39
#define SOULMATE_DATA_PIN 32
#define SOULMATE_CLOCK_PIN 26`
    : ""
}

#include <Soulmate.h>

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