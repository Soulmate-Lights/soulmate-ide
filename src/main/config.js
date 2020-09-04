import ConfigContainer from "~/containers/config";
import Header from "./components/Header";
import { Link } from "react-router-dom";

const Config = () => {
  const {
    config,
    setConfig,
    type,
    setType,
    types,
  } = ConfigContainer.useContainer();

  const disableCustom = type !== "custom";

  return (
    <div className="w-full flex flex-col">
      <Header title="Config" />

      <div className="p-8 overflow-auto flex flex-col flex-shrink min-h-0">
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 ">
                  Soulmate config
                </h3>
                <p className="mt-1 text-sm leading-5 ">
                  What kind of Soulmate are you using?
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form action="#" method="POST">
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white text-gray-800 sm:p-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-5 text-gray-700"
                      >
                        Soulmate type
                      </label>
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        id="country"
                        className="mt-1 block form-select w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      >
                        {types.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {!disableCustom && (
                      <div className="mt-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="col-span-2 sm:col-span-2 w-full flex-grow">
                            <label
                              htmlFor="company_website"
                              className="block text-sm font-medium leading-5 text-gray-700"
                            >
                              Pins
                            </label>
                            <div className="mt-1 flex w-full space-x-4">
                              <div className="flex flex-row items-center w-6/12">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 h-10">
                                  Data
                                </span>
                                <input
                                  disabled={disableCustom}
                                  onChange={(e) =>
                                    setConfig({
                                      ...config,
                                      data: parseInt(e.target.value),
                                    })
                                  }
                                  value={config.data}
                                  className="w-24 h-10 form-input flex-1 block rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm"
                                />
                              </div>
                              <div className="flex flex-row items-center w-6/12">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 h-10">
                                  Clock
                                </span>
                                <input
                                  disabled={disableCustom}
                                  onChange={(e) =>
                                    setConfig({
                                      ...config,
                                      clock: parseInt(e.target.value),
                                    })
                                  }
                                  value={config.clock}
                                  className="w-24 h-10 form-input flex-1 block rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm"
                                />
                              </div>
                              <div className="flex flex-row items-center w-6/12">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 h-10">
                                  Button
                                </span>
                                <input
                                  disabled={disableCustom}
                                  onChange={(e) =>
                                    setConfig({
                                      ...config,
                                      button: parseInt(e.target.value),
                                    })
                                  }
                                  value={config.button}
                                  className="w-24 h-10 form-input flex-1 block rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col-span-2 sm:col-span-2 w-full flex-grow">
                            <label
                              htmlFor="company_website"
                              className="block text-sm font-medium leading-5 text-gray-700"
                            >
                              Dimensions
                            </label>
                            <div className="mt-1 flex w-full">
                              <div className="flex flex-row items-center w-6/12">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 h-10">
                                  Rows
                                </span>
                                <input
                                  disabled={disableCustom}
                                  onChange={(e) =>
                                    setConfig({
                                      ...config,
                                      rows: parseInt(e.target.value),
                                    })
                                  }
                                  value={config.rows}
                                  className="w-24 h-10 mr-8 form-input flex-1 block rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm"
                                />
                              </div>
                              <div className="flex flex-row items-center w-6/12">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 h-10">
                                  Cols
                                </span>
                                <input
                                  disabled={disableCustom}
                                  onChange={(e) =>
                                    setConfig({
                                      ...config,
                                      cols: parseInt(e.target.value),
                                    })
                                  }
                                  value={config.cols}
                                  className="w-24 h-10 form-input flex-1 block rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="first_name"
                              className="block text-sm font-medium leading-5 text-gray-700"
                            >
                              Power (milliamps)
                            </label>
                            <input
                              value={config.milliamps}
                              disabled={disableCustom}
                              onChange={(e) => {
                                setConfig({
                                  ...config,
                                  milliamps: parseInt(e.target.value),
                                });
                              }}
                              id="first_name"
                              className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <div className="col-span-6 sm:col-span-3">
                            <label
                              htmlFor="first_name"
                              className="block text-sm font-medium leading-5 text-gray-700"
                            >
                              Serpentine layout (left-right-left)
                            </label>
                            <input
                              type="checkbox"
                              checked={config.serpentine}
                              disabled={disableCustom}
                              onChange={(e) => {
                                setConfig({
                                  ...config,
                                  serpentine: e.target.checked,
                                });
                              }}
                              id="serpentine"
                              // className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            />
                          </div>
                        </div>

                        <div className="col-span-6 sm:col-span-3 mt-6">
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-5 text-gray-700"
                          >
                            LED type
                          </label>
                          <select
                            value={config.ledType}
                            onChange={(e) => {
                              setConfig({
                                ...config,
                                ledType: e.target.value,
                              });
                            }}
                            id="country"
                            className="mt-1 block form-select w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          >
                            {["APA102", "WS2812B"].map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="py-3 mt-4 text-right">
                  <Link
                    to="/flash"
                    className="py-2 px-8 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-500 focus:outline-none focus:shadow-outline-blue focus:bg-indigo-500 active:bg-indigo-600 transition duration-150 ease-in-out"
                  >
                    Save
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Config;
