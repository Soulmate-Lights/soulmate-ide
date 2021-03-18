import { Helmet } from "react-helmet";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { Link } from "react-router-dom";

import InstallPython, { needsPython } from "~/components/InstallPython";
import SoulmatesContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import useSavedFirmware from "~/hooks/useSavedFirmware";
import Logo from "~/images/logo.svg";
import soulmateName from "~/utils/soulmateName";
import { types } from "~/utils/types";

import Header from "../components/Header";
import { sketch } from "./code";
import { Left, Right, Section } from "./components";

const Config = () => {
  const { isAdmin } = UserContainer.useContainer();

  const {
    config: originalConfig,
    flashSketches,
    flashing,
    selectedSoulmate,
    usbFlashingPercentage,
  } = SoulmatesContainer.useContainer();

  const savedFirmware = useSavedFirmware(selectedSoulmate);
  const sketches = savedFirmware?.sketches || [sketch];

  // Flashing

  const [justFlashed, setJustFlashed] = useState(false);

  useEffect(() => {
    if (usbFlashingPercentage === 100) setJustFlashed(true);
  }, [usbFlashingPercentage]);

  // Config

  const [config, setConfig] = useState(
    originalConfig || {
      button: 39,
      data: 32,
      clock: 26,
      milliamps: 1000,
    }
  );

  const updateConfig = (newConfig) => {
    setConfig({ ...config, ...newConfig });
  };

  useEffect(() => {
    setConfig(originalConfig);
  }, [originalConfig]);

  const dirty = originalConfig != config && !flashing;
  const isUsingCustomChip =
    config.button !== 39 || config.data !== 32 || config.clock !== 26;

  // Early return templates

  if (needsPython()) return <InstallPython />;

  if (!selectedSoulmate) {
    return (
      <div className="flex flex-col items-center p-8 mx-auto my-auto text-center bg-white rounded-lg shadow w-72">
        <span>No Soulmate selected!</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-shrink min-h-0 p-8 overflow-auto space-y-10">
      {isAdmin() && (
        <Section>
          <Left>
            <h3 className="text-lg font-medium leading-6 ">Soulmate config</h3>
            <p className="mt-1 text-sm leading-5 ">
              What kind of Soulmate are you using?
            </p>
          </Left>
          <Right>
            <p>
              {types.map((t) => (
                <button
                  className="h-auto p-2 mr-2 button"
                  key={t.label}
                  onClick={() => flashSketches([sketch], t.config)}
                >
                  {t.label}
                </button>
              ))}
            </p>
          </Right>
        </Section>
      )}
      <Section>
        <Left>
          <h3 className="text-lg font-medium leading-6 ">LED setup</h3>
          <p className="mt-1 text-sm leading-5 ">
            How many LEDs are you running?
          </p>
        </Left>
        <Right>
          <div className="flex-grow w-full col-span-2 sm:col-span-2">
            <label
              className="block text-sm font-medium text-gray-700 leading-5"
              htmlFor="country"
            >
              LED type
            </label>
            <select
              className="block w-full px-3 py-2 mt-1 bg-white border-gray-300 form-select rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              onChange={(e) => updateConfig({ ledType: e.target.value })}
              value={config.ledType}
            >
              <option disabled value="">
                Choose a chipset
              </option>
              <option value="APA102">APA102 - 4 wires</option>
              <option value="WS2812B">WS2812B - 3 wires</option>
            </select>
          </div>
          <div className="flex-grow w-full col-span-2 sm:col-span-2">
            <label
              className="block text-sm font-medium text-gray-700 leading-5"
              htmlFor="company_website"
            >
              Dimensions
            </label>

            <div className="flex w-full mt-1">
              <div className="flex flex-row items-center w-6/12">
                <span className="inline-flex items-center h-10 px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                  Rows
                </span>
                <input
                  className="flex-1 block w-24 h-10 mr-8 rounded-none form-input rounded-r-md transition duration-150 ease-in-out sm:text-sm focus:shadow-outline-blue focus:border-blue-300"
                  onChange={(e) => updateConfig({ rows: e.target.value })}
                  placeholder="10"
                  type="text"
                  value={config.rows}
                />
              </div>
              <div className="flex flex-row items-center w-6/12">
                <span className="inline-flex items-center h-10 px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                  Columns
                </span>
                <input
                  className="flex-1 block w-24 h-10 rounded-none form-input rounded-r-md transition duration-150 ease-in-out sm:text-sm focus:shadow-outline-blue focus:border-blue-300"
                  onChange={(e) => updateConfig({ cols: e.target.value })}
                  placeholder="10"
                  type="text"
                  value={config.cols}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="col-span-6 sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700 leading-5">
                Power (milliamps)
                <input
                  className="block w-full px-3 py-2 mt-1 border-gray-300 form-input rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  onChange={(e) =>
                    updateConfig({ milliamps: parseInt(e.target.value) || 0 })
                  }
                  placeholder="1000"
                  type="text"
                  value={config.milliamps}
                />
              </label>
            </div>
          </div>

          <div className="flex flex-row space-x-8">
            <label className="flex flex-row items-center block text-sm font-medium text-gray-700 leading-5">
              <input
                checked={config.serpentine}
                className="mr-2"
                onChange={(e) => updateConfig({ serpentine: e.target.checked })}
                type="checkbox"
              />
              Serpentine layout
            </label>
            <label className="flex flex-row items-center block text-sm font-medium text-gray-700 leading-5">
              <input
                checked={config.mirror}
                className="mr-2"
                onChange={(e) => updateConfig({ mirror: e.target.checked })}
                type="checkbox"
              />
              Mirror Horizontal
            </label>

            <label className="flex flex-row items-center block text-sm font-medium text-gray-700 leading-5">
              <input
                checked={config.reverse}
                className="mr-2"
                onChange={(e) => updateConfig({ reverse: e.target.checked })}
                type="checkbox"
              />
              Flip Vertical
            </label>
          </div>
        </Right>
      </Section>

      <Section>
        <Left>
          <h3 className="text-lg font-medium leading-6 ">Soulmate config</h3>
          <p className="mt-1 text-sm leading-5 ">
            What kind of chip are you using?
          </p>
        </Left>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="text-gray-800 ">
            <button
              className={classnames(
                "w-6/12 p-5 rounded-lg rounded-r-none focus:outline-none border border-gray-200 bg-gray-50",
                {
                  "shadow-inner bg-purple-600 border-purple-600 text-white": !isUsingCustomChip,
                }
              )}
              onClick={() => updateConfig({ button: 39, data: 32, clock: 26 })}
            >
              M5 Atom (Soulmate)
            </button>
            <button
              className={classnames(
                "w-6/12 p-5 rounded-lg rounded-l-none focus:outline-none border border-gray-200 bg-gray-50",
                {
                  "shadow-inner bg-purple-600 border-purple-600 text-white": isUsingCustomChip,
                }
              )}
              onClick={() =>
                updateConfig({
                  button: undefined,
                  data: undefined,
                  clock: undefined,
                })
              }
            >
              My own ESP32
            </button>
          </div>
        </div>
      </Section>

      {isUsingCustomChip && (
        <Section>
          <Left>
            <h3 className="text-lg font-medium leading-6 ">Custom config</h3>
            <p className="mt-1 text-sm leading-5 ">
              Customize which pins this Soulmate will be using.
            </p>
          </Left>

          <Right>
            {isUsingCustomChip && (
              <div className="grid grid-cols-2 gap-6">
                <div className="flex-grow w-full col-span-2 sm:col-span-2">
                  <div className="flex w-full mt-1 space-x-4">
                    <div className="flex flex-row items-center w-6/12">
                      <span className="inline-flex items-center h-10 px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                        Data
                      </span>
                      <input
                        className="flex-1 block w-24 h-10 rounded-none form-input rounded-r-md transition duration-150 ease-in-out sm:text-sm focus:shadow-outline-blue focus:border-blue-300"
                        onChange={(e) => updateConfig({ data: e.target.value })}
                        placeholder="Data pin number"
                        type="text"
                        value={config.data}
                      />
                    </div>
                    {config.ledType == "APA102" && (
                      <div className="flex flex-row items-center w-6/12">
                        <span className="inline-flex items-center h-10 px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                          Clock
                        </span>
                        <input
                          className="flex-1 block w-24 h-10 rounded-none form-input rounded-r-md transition duration-150 ease-in-out sm:text-sm"
                          onChange={(e) =>
                            updateConfig({ clock: e.target.value })
                          }
                          placeholder="Clock pin number"
                          type="text"
                          value={config.clock}
                        />
                      </div>
                    )}
                    <div className="flex flex-row items-center w-6/12">
                      <span className="inline-flex items-center h-10 px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                        Button
                      </span>
                      <input
                        className="flex-1 block w-24 h-10 rounded-none form-input rounded-r-md transition duration-150 ease-in-out sm:text-sm focus:shadow-outline-blue focus:border-blue-300"
                        onChange={(e) =>
                          updateConfig({ button: e.target.value })
                        }
                        type="text"
                        value={config.button}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Right>
        </Section>
      )}

      <div className="md:grid md:grid-cols-3">
        <div className="md:col-span-1"></div>

        <div className="flex justify-end mt-0 col-span-6 sm:col-span-3 space-x-2">
          <span className="flex items-center justify-end flex-grow block pr-4 leading-2">
            {flashing && <>Your Soulmate is being configured. Hang tight!</>}

            {justFlashed && !dirty && (
              <>
                You&apos;re all set! Your Soulmate&apos;s LEDs should be green.
                Time to add some patterns!
              </>
            )}
          </span>

          {dirty && (
            <button
              className="text-gray-500 bg-white footer-button"
              onClick={() => setConfig(originalConfig)}
            >
              Reset
            </button>
          )}

          {!justFlashed && (
            <button
              className="flex-shrink-0 footer-button"
              onClick={() => flashSketches(sketches, config)}
            >
              {flashing ? (
                <>
                  <Logo className="w-6 h-6 mr-6 spin" />
                  <progress
                    className="my-2 usb-flash"
                    max="100"
                    value={usbFlashingPercentage}
                  >
                    {usbFlashingPercentage}%{" "}
                  </progress>
                </>
              ) : (
                <>Reconfigure {soulmateName(selectedSoulmate)}</>
              )}
            </button>
          )}

          {justFlashed && (
            <Link className="flex-shrink-0 footer-button" to="/soulmate">
              <HiOutlineLightningBolt className="w-6 h-6 mr-3 transition ease-in-out duration-150" />
              Upload patterns
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

const WrappedConfig = (props) => (
  <div className="flex flex-col w-full dark-mode:text-gray-800">
    <Header title="Config" />
    <Helmet>
      <title>Config</title>
    </Helmet>
    <Config {...props} />
  </div>
);

export default WrappedConfig;
