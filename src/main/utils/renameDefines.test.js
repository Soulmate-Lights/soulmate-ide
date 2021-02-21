import renameDefines from "./replaceDefines";

describe("Renaming defines", () => {
  it("renames defines", () => {
    const input = "#define MYTHING";
    const prefix = "hello_";
    const expectedOutput = "#define hello_MYTHING";

    expect(renameDefines(input, prefix)).toEqual(expectedOutput);
  });

  it("renames function defines", () => {
    const input = "#define MYTHING(int a, int b)";
    const prefix = "hello_";
    const expectedOutput = "#define hello_MYTHING(int a, int b)";

    expect(renameDefines(input, prefix)).toEqual(expectedOutput);
  });

  it("renames things when used multiple times", () => {
    const input = `
    #define MYTHING(int a, int b)
    MYTHING(1, 2);`;
    const prefix = "hello_";

    const expectedOutput = `
    #define hello_MYTHING(int a, int b)
    hello_MYTHING(1, 2);`;

    expect(renameDefines(input, prefix)).toEqual(expectedOutput);
  });
});

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

  const result = renameDefines(_input, "prefix_").trim();

  expect(result).toEqual(expectedOutput);
};

describe("replacing defines", () => {
  it("Replaces simple values", () => {
    testReplaceDefines(
      `#define ABC 123
      #define THING "a thing"
      int a = ABC;
      String b = THING;`,

      `#define prefix_ABC 123
      #define prefix_THING "a thing"
      int a = prefix_ABC;
      String b = prefix_THING;`
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
      #define prefix_NUM_ROWS LED_ROWS
      #define prefix_NUM_COLS LED_COLS

      // LED brightness
      #define prefix_BRIGHTNESS 255
      #define prefix_NUM_LEDS prefix_NUM_ROWS * prefix_NUM_COLS
      byte hue = 0;

      void patt1(uint8_t i, uint8_t j, uint8_t color1, uint8_t color2) {
        //  leds[XY(i, j)] = CHSV(0, 255, 0);
        leds[XY(i + 1, j)] = CHSV(color1, 255, prefix_BRIGHTNESS);
        leds[XY(i + 1, j + 1)] = CHSV(color1, 255, prefix_BRIGHTNESS);
        leds[XY(i, j + 1)] = CHSV(color2, 255, prefix_BRIGHTNESS);
      }

      void patt2(uint8_t i, uint8_t j, uint8_t color1, uint8_t color2) {
        //  leds[XY(i, j)] = CHSV(0, 255, 0);
        leds[XY(i + 1, j)] = CHSV(color1, 255, prefix_BRIGHTNESS);
        leds[XY(i + 1, j + 1)] = CHSV(color2, 255, prefix_BRIGHTNESS);
        leds[XY(i, j + 1)] = CHSV(color2, 255, prefix_BRIGHTNESS);
      }


      void draw() {

        EVERY_N_MILLISECONDS(50) { hue++; }

        for (byte i = 0; i < prefix_NUM_COLS; i += 4) {
          for (byte j = 0; j < prefix_NUM_ROWS; j += 4) {

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
      `#define prefix_abc 123
      int thing = 2;
      int otherThing = prefix_abc;`
    );
  });

  it("handles multiple passes", () => {
    testReplaceDefines(
      `#define NUM_ROWS LED_ROWS
      #define NUM_COLS LED_COLS
      #define NUM_LEDS NUM_ROWS * NUM_COLS
      let's talk about NUM_LEDS and NUM_ROWS;`,
      `#define prefix_NUM_ROWS LED_ROWS
      #define prefix_NUM_COLS LED_COLS
      #define prefix_NUM_LEDS prefix_NUM_ROWS * prefix_NUM_COLS
      let's talk about prefix_NUM_LEDS and prefix_NUM_ROWS;`
    );
  });

  it("handles odd spaces", () => {
    testReplaceDefines(
      `#define  GLOBAL_COLOR_1 CRGB::Green
      I am GLOBAL_COLOR_1;`,
      `#define  prefix_GLOBAL_COLOR_1 CRGB::Green
      I am prefix_GLOBAL_COLOR_1;`
    );
  });

  it("handles ldir example", () => {
    testReplaceDefines(
      `#define r random8()
       color.h+=random8(val);
       a = r('hi');
      `,
      `#define prefix_r random8()
       color.h+=random8(val);
       a = prefix_r('hi');
      `
    );
  });
});
