import { Helmet } from "react-helmet";
import { RiUsbLine } from "react-icons/ri";

import SoulmatesContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import Logo from "~/images/Logo";
import { types } from "~/utils/types";

import Header from "./components/Header";

const sketch = {
  code: `
  void draw() {
    fill_solid(leds, N_LEDS, CRGB::Green);
  }
`,
  name: "Test Pattern (green)",
};

const Section = (props) => (
  <div className="md:grid md:grid-cols-3 md:gap-6">{props.children}</div>
);

const Left = (props) => (
  <div className="md:col-span-1">
    <div className="px-4 sm:px-0">{props.children}</div>
  </div>
);

const Right = (props) => (
  <div className="px-4 py-5 mt-5 text-gray-800 shadow md:mt-0 md:col-span-2 sm:rounded-md sm:overflow-hidden bg-gray-50 dark-mode:bg-gray-100 sm:p-6 col-span-6 sm:col-span-3 space-y-6">
    {props.children}
  </div>
);

const Config = () => {
  const { isAdmin } = UserContainer.useContainer();

  const {
    config: _config,
    usbConnected,
    flashSketches,
    flashing,
    usbFlashingPercentage,
  } = SoulmatesContainer.useContainer();

  const [config, setConfig] = useState(
    _config || { button: 39, data: 32, clock: 26, milliamps: 1000 }
  );

  useEffect(() => {
    setConfig(_config);
  }, [_config]);

  const isUsingCustomChip =
    config.button !== 39 || config.data !== 32 || config.clock !== 26;

  if (!usbConnected) {
    return (
      <div className="flex flex-col w-full dark-mode:text-gray-800">
        <Helmet>
          <title>Config &mdash; Soulmate IDE</title>
        </Helmet>
        <Header title="Config" />

        <div className="flex flex-col items-center p-8 mx-auto my-auto text-center bg-white rounded-lg shadow w-72">
          <RiUsbLine className="w-24 h-24 mb-4 opacity-80" />
          <span>Connect your Soulmate with a USB cable to configure.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      <Helmet>
        <title>Config &mdash; Soulmate IDE</title>
      </Helmet>
      <Header title="Config" />

      <div className="flex flex-col flex-shrink min-h-0 p-8 overflow-auto">
        <div className="space-y-10">
          {isAdmin() && (
            <Section>
              <Left>
                <h3 className="text-lg font-medium leading-6 ">
                  Soulmate config
                </h3>
                <p className="mt-1 text-sm leading-5 ">
                  What kind of Soulmate are you using?
                </p>
              </Left>
              <Right>
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 leading-5"
                    htmlFor="country"
                  >
                    Flash a pre-configured type of Soulmate (Admin only)
                  </label>

                  <p className="mt-4">
                    {types.map((t) => (
                      <button
                        className="h-auto p-2 mr-2 button"
                        key={t.label}
                        onClick={() => {
                          flashSketches([sketch], t.config);
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </p>
                </div>
              </Right>
            </Section>
          )}

          <>
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
                    id="country"
                    onChange={(e) => {
                      setConfig({
                        ...config,
                        ledType: e.target.value,
                      });
                    }}
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
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            rows: e.target.value,
                          })
                        }
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
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            cols: e.target.value,
                          })
                        }
                        type="text"
                        value={config.cols}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="col-span-6 sm:col-span-3">
                    <label
                      className="block text-sm font-medium text-gray-700 leading-5"
                      htmlFor="first_name"
                    >
                      Power (milliamps)
                      <input
                        className="block w-full px-3 py-2 mt-1 border-gray-300 form-input rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        id="first_name"
                        onChange={(e) => {
                          setConfig({
                            ...config,
                            milliamps: parseInt(e.target.value) || 0,
                          });
                        }}
                        type="text"
                        value={config.milliamps}
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-row space-x-8">
                  <label
                    className="flex flex-row items-center block text-sm font-medium text-gray-700 leading-5"
                    htmlFor="first_name"
                  >
                    <input
                      checked={config.serpentine}
                      className="mr-2"
                      id="serpentine"
                      onChange={(e) => {
                        setConfig({
                          ...config,
                          serpentine: e.target.checked,
                        });
                      }}
                      type="checkbox"
                    />
                    Serpentine layout
                  </label>
                  <label
                    className="flex flex-row items-center block text-sm font-medium text-gray-700 leading-5"
                    htmlFor="first_name"
                  >
                    <input
                      checked={config.mirror}
                      className="mr-2"
                      id="mirror"
                      onChange={(e) => {
                        setConfig({
                          ...config,
                          mirror: e.target.checked,
                        });
                      }}
                      type="checkbox"
                    />
                    Mirror
                  </label>
                </div>
              </Right>
            </Section>

            <Section>
              <Left>
                <h3 className="text-lg font-medium leading-6 ">
                  Soulmate config
                </h3>
                <p className="mt-1 text-sm leading-5 ">
                  What kind of chip are you using?
                </p>
              </Left>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div className="text-gray-800 ">
                  <button
                    className={classnames(
                      "w-6/12 p-5 rounded-lg",
                      "rounded-r-none",
                      "focus:outline-none",
                      "border border-gray-200",
                      "bg-gray-50",
                      {
                        "shadow-inner bg-purple-600 border-purple-600 text-white": !isUsingCustomChip,
                      }
                    )}
                    onClick={() => {
                      setConfig({
                        ...config,
                        button: 39,
                        data: 32,
                        clock: 26,
                      });
                    }}
                  >
                    M5 Atom (Soulmate)
                  </button>
                  <button
                    className={classnames(
                      "w-6/12 p-5 rounded-lg",
                      "rounded-l-none",
                      "focus:outline-none",
                      "border border-gray-200",
                      "bg-gray-50",
                      {
                        "shadow-inner bg-purple-600 border-purple-600 text-white": isUsingCustomChip,
                      }
                    )}
                    onClick={() => {
                      setConfig({
                        ...config,
                        button: undefined,
                        data: undefined,
                        clock: undefined,
                      });
                    }}
                  >
                    My own ESP32
                  </button>
                </div>
              </div>
            </Section>

            {isUsingCustomChip && (
              <Section>
                <Left>
                  <h3 className="text-lg font-medium leading-6 ">
                    Custom config
                  </h3>
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
                              onChange={(e) =>
                                setConfig({
                                  ...config,
                                  data: e.target.value,
                                })
                              }
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
                                  setConfig({
                                    ...config,
                                    clock: e.target.value,
                                  })
                                }
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
                                setConfig({
                                  ...config,
                                  button: e.target.value,
                                })
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
          </>

          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1"></div>

            <div className="mt-5 md:mt-0 md:col-span-2">
              <div className="sm:rounded-md sm:overflow-hidden">
                <div className="flex justify-end col-span-6 sm:col-span-3">
                  <div className="flex flex-row space-x-4">
                    {_config != config && !flashing && (
                      <button
                        className="text-gray-500 bg-white footer-button"
                        onClick={() => {
                          setConfig(_config);
                        }}
                      >
                        Cancel
                      </button>
                    )}

                    <button
                      className="footer-button"
                      onClick={() => {
                        flashSketches([sketch], config);
                      }}
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
                        <>Configure my Soulmate</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Config;
