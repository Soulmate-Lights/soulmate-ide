import replaceDefines from "./replaceDefines";

const testReplaceDefines = (input, output) => {
  const _input = input
    .split("\n")
    .map((l) => l.trim())
    .join("\n");
  const expectedOutput = output
    .split("\n")
    .map((l) => l.trim())
    .join("\n")
    .trim();

  const result = replaceDefines(_input).trim();

  expect(result).toEqual(expectedOutput);
};

describe("urls", () => {
  it("Replaces simple values", () => {
    testReplaceDefines(
      `#define ABC 123
      #define THING "a thing"
      int a = ABC;
      String b = THING;`,

      `int a = 123;
      String b = "a thing";
    `
    );
  });

  it("Cleans up a sketch", () => {
    testReplaceDefines(
      `
      // Matrix size
      #define NUM_ROWS LED_ROWS
      #define NUM_COLS LED_COLS

      // LED brightness
      #define BRIGHTNESS 255
      #define NUM_LEDS NUM_ROWS * NUM_COLS
      byte hue = 0;

      void patt1(uint8_t i, uint8_t j, uint8_t color1, uint8_t color2) {
        //  leds[XY(i, j)] = CHSV(0, 255, 0);
        leds[XY(i + 1, j)] = CHSV(color1, 255, BRIGHTNESS);
        leds[XY(i + 1, j + 1)] = CHSV(color1, 255, BRIGHTNESS);
        leds[XY(i, j + 1)] = CHSV(color2, 255, BRIGHTNESS);
      }

      void patt2(uint8_t i, uint8_t j, uint8_t color1, uint8_t color2) {
        //  leds[XY(i, j)] = CHSV(0, 255, 0);
        leds[XY(i + 1, j)] = CHSV(color1, 255, BRIGHTNESS);
        leds[XY(i + 1, j + 1)] = CHSV(color2, 255, BRIGHTNESS);
        leds[XY(i, j + 1)] = CHSV(color2, 255, BRIGHTNESS);
      }


      void draw() {

        EVERY_N_MILLISECONDS(50) { hue++; }

        for (byte i = 0; i < NUM_COLS; i += 4) {
          for (byte j = 0; j < NUM_ROWS; j += 4) {

            patt1(i, j, 64 + j + hue, i + hue);
            patt1(i + 2, j + 2, 64 + j + hue, i + hue);
            patt2(i, j + 2, 64 + j + hue, i + hue);
            patt2(i + 2, j, 64 + j + hue, i + hue);

          }
        }
      }`,
      `
      // Matrix size



      // LED brightness


      byte hue = 0;

      void patt1(uint8_t i, uint8_t j, uint8_t color1, uint8_t color2) {
        //  leds[XY(i, j)] = CHSV(0, 255, 0);
        leds[XY(i + 1, j)] = CHSV(color1, 255, 255);
        leds[XY(i + 1, j + 1)] = CHSV(color1, 255, 255);
        leds[XY(i, j + 1)] = CHSV(color2, 255, 255);
      }

      void patt2(uint8_t i, uint8_t j, uint8_t color1, uint8_t color2) {
        //  leds[XY(i, j)] = CHSV(0, 255, 0);
        leds[XY(i + 1, j)] = CHSV(color1, 255, 255);
        leds[XY(i + 1, j + 1)] = CHSV(color2, 255, 255);
        leds[XY(i, j + 1)] = CHSV(color2, 255, 255);
      }


      void draw() {

        EVERY_N_MILLISECONDS(50) { hue++; }

        for (byte i = 0; i < LED_COLS; i += 4) {
          for (byte j = 0; j < LED_ROWS; j += 4) {

            patt1(i, j, 64 + j + hue, i + hue);
            patt1(i + 2, j + 2, 64 + j + hue, i + hue);
            patt2(i, j + 2, 64 + j + hue, i + hue);
            patt2(i + 2, j, 64 + j + hue, i + hue);

          }
        }
      }`
    );
  });

  it("Doesn't fail on single-variable defines", () => {
    testReplaceDefines(
      `#define abc 123
      int thing = 2;
      int otherThing = abc;
      `,
      `int thing = 2;
      int otherThing = 123;`
    );
  });

  it("handles multiple passes", () => {
    testReplaceDefines(
      `#define NUM_ROWS LED_ROWS
      #define NUM_COLS LED_COLS
      #define NUM_LEDS NUM_ROWS * NUM_COLS
      let's talk about NUM_LEDS and NUM_ROWS;`,
      `let's talk about LED_ROWS * LED_COLS and LED_ROWS;`
    );
  });

  it("handles odd spaces", () => {
    testReplaceDefines(
      `
      #define  GLOBAL_COLOR_1 CRGB::Green
      I am GLOBAL_COLOR_1;
    `,
      `I am CRGB::Green;`
    );
  });
});
