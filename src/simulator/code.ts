export const prepareCode = (code, rows, cols) =>
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
}

namespace Pattern {
  ${code}
}

void loop() {
  Pattern::draw();
  FastLED.show();
}
`.trim();


export const prepareFullCode = (code, rows, cols) => `
// Don't forget to change this!
#define FIRMWARE_NAME "soulmate-custom"
// The number of LEDs in each parallel strip
#define LED_COLS 32
// The number of parallel strips
#define LED_ROWS 2
// Normally LED_COLS * LED_ROWS
#define N_LEDS 64
// If you're using WS2812B LED strips, uncomment this line
// #define USE_WS2812B true
// How long should we spend in each pattern?
#define CYCLE_LENGTH_IN_MS 120000
// How long should the Soulmate fade between patterns?
#define FADE_DURATION 3000
// Total power in milliamps
#define SOULMATE_MILLIAMPS 700

#include <Soulmate.h>

namespace Pattern {
  ${code}
}

void setup() {
  Soulmate.addRoutine("Sample Pattern", Pattern::draw);
  Soulmate.setup();
}

void loop() {
  Soulmate.loop();
}`