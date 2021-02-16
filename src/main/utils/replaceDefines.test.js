import replaceDefines from "./replaceDefines";

describe("urls", () => {
  it("Replaces simple values", () => {
    const sketch = `
      #define ABC 123
      #define THING "a thing"
      int a = ABC;
      String b = THING;
    `;

    expect(replaceDefines(sketch)).toEqual(`


      int a = 123;
      String b = "a thing";
    `);
  });

  it("Cleans up a sketch", () => {
    const sketch = `
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
}`;

    expect(replaceDefines(sketch)).toEqual(`
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
}`);
  });

  it("Doesn't fail on single-variable defines", () => {
    const sketch = `
#define abc 123
int thing = 2;
int otherThing = abc;`;

    expect(replaceDefines(sketch)).toEqual(
      `

int thing = 2;
int otherThing = 123;`
    );
  });

  it("handles multiple passes", () => {
    const sketch = `
#define NUM_ROWS LED_ROWS
#define NUM_COLS LED_COLS
#define NUM_LEDS NUM_ROWS * NUM_COLS
let's talk about NUM_LEDS and NUM_ROWS;`;

    expect(replaceDefines(sketch).trim()).toEqual(
      `let's talk about LED_ROWS * LED_COLS and LED_ROWS;`
    );
  });

  it("handles odd spaces", () => {
    const sketch = `
#define  GLOBAL_COLOR_1 CRGB::Green
I am GLOBAL_COLOR_1;
`;

    expect(replaceDefines(sketch).trim()).toEqual(`I am CRGB::Green;`);
  });
});
