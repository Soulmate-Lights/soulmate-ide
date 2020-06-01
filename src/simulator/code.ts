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
