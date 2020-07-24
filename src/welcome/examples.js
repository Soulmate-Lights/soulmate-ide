export default [
  `// Welcome to the Soulmate IDE!
// Let's go through a few easy examples to get started.

// This draw() function is called repeatedly while your Soulmate is on.
void draw() {
  // N_LEDS is the total number of LEDs (LED_COLS * LED_ROWS)
  for (int index = 0; index < N_LEDS; index++) {
    // leds is the LED array, and CRGB::Blue is the FastLED color we want
    leds[index] = CRGB::Blue;
  }
}`,
  `// This code runs first, to set things up
int hue = 0;

void draw() {
  // This line changes the hue every loop
  hue++;

  for (int index = 0; index < N_LEDS; index++) {
    leds[index] = CHSV(hue, 255, 255);
  }
}`,
  `int hue = 0;

void draw() {
  // That was a bit fast! Let's slow it down a bit.

  // EVERY_N_MILLISECONDS: run the code every N milliseconds
  EVERY_N_MILLISECONDS(100) {
    hue++;
  }

  for (int index = 0; index < N_LEDS; index++) {
    leds[index] = CHSV(hue, 255, 255);
  }
}`,
  `void draw() {
  // Let's use the index to determine the hue:
  for (int index = 0; index < N_LEDS; index++) {
    leds[index] = CHSV(index, 255, 255);
  }
}`,
  `int offset = 0;

void draw() {
  offset++;

  for (int x = 0; x < COLS; x++) {
    for (int y = 0; y < ROWS; y++) {
      // gridIndexHorizontal tells us the index of a given X/Y coordinate
      int index = gridIndexHorizontal(x, y);

      // Let's take the X and Y values, and add them together to get the hue
      int hue = x * 10 + y * 10;

      // add the offset so it changes every frame
      hue += offset;
      leds[index] = CHSV(hue, 255, 255);
    }
  }
}`,
  `void draw() {
  // Now let's use a sine wave to move this gradient back and forth!

  // uint8_t beatsin8(bpm, minimum, maximum, offset) - an 8-bit sine wave
  int offset = beatsin8(12, 0, 255);

  for (int x = 0; x < COLS; x++) {
    for (int y = 0; y < ROWS; y++) {
      int index = gridIndexHorizontal(x, y);
      int hue = y * 10 + x * 10;
      leds[index] = CHSV(hue + offset, 255, 255);
    }
  }
}`,
  `int hue = 50;

void draw() {
  // 6 beats per minute, between 1 and 10
  int numberOfSparkles = beatsin16(6, 1, 10);

  EVERY_N_MILLISECONDS(20) {
    for (int i = 0; i < numberOfSparkles; i++) {
      int pos = random16(N_LEDS);
      if (!Soulmate.leds[pos]) {
        Soulmate.leds[pos] = CHSV(hue + (pos / 10), 255, 255);
      }
    }
  }

  EVERY_N_MILLISECONDS(40) {
    hue -= 1;
  }

  fade_raw(Soulmate.leds, N_LEDS, 4);
}`,
];
