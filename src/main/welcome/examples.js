export default [
  `// Welcome to the Soulmate IDE!

// Let's go through a few easy code examples to get started.

// You can edit the code in this text editor, and then press CMD+S to run your code.

// This draw() function is called repeatedly while your Soulmate is on.
void draw() {
  // We'll loop through every led in the leds array, and set its color

  // N_LEDS is the total number of LEDs (LED_COLS * LED_ROWS)
  for (int index = 0; index < N_LEDS; index++) {
    // leds is the LED array, and CRGB::Blue is the FastLED color we want
    leds[index] = CRGB::Blue;

    // Try these:
    // leds[index] = CRGB::Red;
    // leds[index] = CRGB::Purple;
    // leds[index] = CRGB(255, 0, 0);
    // leds[index] = CRGB(255, 0, 255);
    // leds[index] = CHSV(0, 255, 255);
  }
}`,
  `// Code above draw() only runs once, to set up our variables
int hue = 0;

void draw() {
  // This line increments the hue variable every loop
  hue++;

  for (int index = 0; index < N_LEDS; index++) {
    // CHSV stands for hue, saturation, value, all 0-255
    leds[index] = CHSV(hue, 255, 255);
  }
}`,
  `// That was a bit fast! Let's slow it down a bit.
int hue = 0;

void draw() {
  // The EVERY_N_MILLISECONDS block runs its code every N milliseconds
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
  `// Let's draw a rainbow this time:
int offset = 0;

void draw() {
  offset++;

  for (int x = 0; x < COLS; x++) {
    for (int y = 0; y < ROWS; y++) {
      // XY tells us the index of a given X/Y coordinate
      int index = XY(x, y);

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
      int index = XY(x, y);
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

      if (!leds[pos]) {
        leds[pos] = CHSV(hue + (pos / 10), 255, 255);
      }
    }
  }

  EVERY_N_MILLISECONDS(40) {
    hue -= 1;
  }

  fade_raw(leds, N_LEDS, 4);
}`,
  `// OK, you're good to go!
// Hit the "Log in" to log in and start making new patterns.
// You can even upload your patterns to your Soulmate over WiFi or USB.

// Before you go, here's one last crazy example:
float offsetX = 0;
float offsetY = 0;
uint8_t hue = 0;

void draw() {
  offsetX = beatsin16(6, -180, 180);
  offsetY = beatsin16(6, -180, 180, 12000);

  EVERY_N_MILLISECONDS(10) {
    hue++;
  }

  for (int x = 0; x < LED_COLS; x++) {
    for (int y = 0; y < LED_ROWS; y++) {
      int16_t index = XY(x, y);

      if (index < 0) break;

      float hue = x * beatsin16(10, 1, 10) + offsetY;
      leds[index] = CHSV(hue, 200, sin8(x * 30 + offsetX));
      hue = y * 3 + offsetX;
      leds[index] += CHSV(hue, 200, sin8(y * 30 + offsetY));
    }
  }
}`,
  `// Here's one last, really fun one from Mark Kriegsman
// https://gist.github.com/kriegsman/5adca44e14ad025e6d3b

const uint8_t kMatrixWidth = LED_COLS;
const uint8_t kMatrixHeight = LED_ROWS;
const uint8_t kBorderWidth = 2;

void draw() {
  // Apply some blurring to whatever's already on the matrix
  // Note that we never actually clear the matrix, we just constantly
  // blur it repeatedly.  Since the blurring is 'lossy', there's
  // an automatic trend toward black -- by design.
  uint8_t blurAmount = 20; // beatsin8(2, 10, 255);
  blur2d(leds, kMatrixWidth, kMatrixHeight, blurAmount);

  // Use two out-of-sync sine waves
  uint8_t i = beatsin8(27, kBorderWidth, kMatrixHeight - kBorderWidth);
  uint8_t j = beatsin8(41, kBorderWidth, kMatrixWidth - kBorderWidth);
  // Also calculate some reflections
  uint8_t ni = (kMatrixWidth - 1) - i;
  uint8_t nj = (kMatrixWidth - 1) - j;

  // The color of each point shifts over time, each at a different speed.
  uint16_t ms = millis();
  leds[XY(i, j)] += CHSV(ms / 11, 200, 255);
  leds[XY(j, i)] += CHSV(ms / 13, 200, 255);
  leds[XY(ni, nj)] += CHSV(ms / 17, 200, 255);
  leds[XY(nj, ni)] += CHSV(ms / 29, 200, 255);
  leds[XY(i, nj)] += CHSV(ms / 37, 200, 255);
  leds[XY(ni, j)] += CHSV(ms / 41, 200, 255);
}`,
];
