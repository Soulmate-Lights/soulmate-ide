import "./style.css";

import Editor from "~/simulator/Editor";
import { Link } from "react-router-dom";
import Logo from "~/images/logo.svg";
import { MdAccountCircle } from "react-icons/md";
import Simulator from "~/simulator/Simulator";
import UserContainer from "~/containers/userContainer";
import { buildHex } from "~/utils/compiler/compile";
import history from "~/utils/history";
import { preparePreviewCode } from "~/utils/code";
import { useContainer } from "unstated-next";

const examples = [
  `void draw() {
  // N_LEDS: total number of LEDs (LED_COLS * LED_ROWS)
  for (int index = 0; index < N_LEDS; index++) {
    // leds: the LED array
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
      // uint16_t gridIndexHorizontal(x, y) gives us the index of a given x/y coordinate
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
];

const Welcome = () => {
  const [index, setIndex] = useState(0);
  const { userDetails, login } = useContainer(UserContainer);
  const [build, setBuild] = useState({});
  const sampleCode = examples[index];

  if (userDetails) {
    history.push("/");
  }

  const config = {
    rows: 20,
    cols: 20,
  };

  const save = async (code) => {
    setBuild(undefined);
    const preparedCode = preparePreviewCode(code, config.rows, config.cols);
    const newBuild = await buildHex(preparedCode);
    setBuild(newBuild);
  };

  useEffect(() => {
    save(sampleCode);
  }, []);

  useEffect(() => {
    setBuild(undefined);
    save(sampleCode);
  }, [index]);

  return (
    <div className="welcome">
      <div className="welcome-header">
        <div className="left">
          <Logo className="logo" />
          Soulmate IDE
        </div>

        <div className="welcome-navigation">
          {examples[index - 1] && (
            <a onClick={() => setIndex(index - 1)} className="button">
              Previous example
            </a>
          )}
          <a
            disabled={!examples[index + 1]}
            onClick={() => {
              examples[index + 1] && setIndex(index + 1);
            }}
            className="button"
          >
            Next example
          </a>
        </div>
      </div>

      <div className="welcome-editor">
        <Editor
          key={index}
          onSave={save}
          build={build}
          sketch={{
            config: config,
            code: sampleCode,
          }}
        />
        <Simulator
          rows={config.rows}
          cols={config.cols}
          build={build}
          width={config.cols * 10}
          height={config.rows * 10}
        />
      </div>
    </div>
  );
};

export default Welcome;
