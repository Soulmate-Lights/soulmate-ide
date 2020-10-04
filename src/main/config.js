import ConfigContainer from "~/containers/config";

import Header from "./components/Header";

const Config = () => {
  const {
    config,
    setConfig,
    type,
    setType,
    types,
  } = ConfigContainer.useContainer();

  const disableCustom = type !== "custom";
  const disableClass = disableCustom ? "bg-gray-100" : "";

  return (
    <div className="flex flex-col w-full">
      <Header title="Config" />

      <div className="flex flex-col flex-shrink min-h-0 p-8 overflow-auto">
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
                  <div className="px-4 py-5 text-gray-800 bg-white sm:p-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        className="block text-sm font-medium text-gray-700 leading-5"
                        htmlFor="country"
                      >
                        Soulmate type
                      </label>
                      <select
                        className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 form-select rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        id="country"
                        onChange={(e) => setType(e.target.value)}
                        value={type}
                      >
                        {types.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mt-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex-grow w-full col-span-2 sm:col-span-2">
                          <label
                            className="block text-sm font-medium text-gray-700 leading-5"
                            htmlFor="company_website"
                          >
                            Pins
                          </label>
                          <div className="flex w-full mt-1 space-x-4">
                            <div className="flex flex-row items-center w-6/12">
                              <span className="inline-flex items-center h-10 px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                                Data
                              </span>
                              <input
                                className={`w-24 h-10 form-input flex-1 block rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm ${disableClass}`}
                                disabled={disableCustom}
                                onChange={(e) =>
                                  setConfig({
                                    ...config,
                                    data: parseInt(e.target.value),
                                  })
                                }
                                value={config.data}
                              />
                            </div>
                            <div className="flex flex-row items-center w-6/12">
                              <span className="inline-flex items-center h-10 px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                                Clock
                              </span>
                              <input
                                className={`w-24 h-10 form-input flex-1 block rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm ${disableClass}`}
                                disabled={disableCustom}
                                onChange={(e) =>
                                  setConfig({
                                    ...config,
                                    clock: parseInt(e.target.value),
                                  })
                                }
                                value={config.clock}
                              />
                            </div>
                            <div className="flex flex-row items-center w-6/12">
                              <span className="inline-flex items-center h-10 px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                                Button
                              </span>
                              <input
                                className={`w-24 h-10 form-input flex-1 block rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm ${disableClass}`}
                                disabled={disableCustom}
                                onChange={(e) =>
                                  setConfig({
                                    ...config,
                                    button: parseInt(e.target.value),
                                  })
                                }
                                value={config.button}
                              />
                            </div>
                          </div>
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
                                className={`w-24 h-10 mr-8 form-input flex-1 block rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm ${disableClass}`}
                                disabled={disableCustom}
                                onChange={(e) =>
                                  setConfig({
                                    ...config,
                                    rows: parseInt(e.target.value),
                                  })
                                }
                                value={config.rows}
                              />
                            </div>
                            <div className="flex flex-row items-center w-6/12">
                              <span className="inline-flex items-center h-10 px-3 text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                                Cols
                              </span>
                              <input
                                className={`w-24 h-10 form-input flex-1 block rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm ${disableClass}`}
                                disabled={disableCustom}
                                onChange={(e) =>
                                  setConfig({
                                    ...config,
                                    cols: parseInt(e.target.value),
                                  })
                                }
                                value={config.cols}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            className="block text-sm font-medium text-gray-700 leading-5"
                            htmlFor="first_name"
                          >
                            Power (milliamps)
                          </label>
                          <input
                            className={`mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${disableClass}`}
                            disabled={disableCustom}
                            id="first_name"
                            onChange={(e) => {
                              setConfig({
                                ...config,
                                milliamps: parseInt(e.target.value),
                              });
                            }}
                            value={config.milliamps}
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="col-span-6 sm:col-span-3">
                          <label
                            className="block text-sm font-medium text-gray-700 leading-5"
                            htmlFor="first_name"
                          >
                            Serpentine layout (left-right-left)
                          </label>
                          <input
                            checked={config.serpentine}
                            disabled={disableCustom}
                            id="serpentine"
                            onChange={(e) => {
                              setConfig({
                                ...config,
                                serpentine: e.target.checked,
                              });
                            }}
                            type="checkbox"
                            // className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          />
                        </div>
                      </div>

                      <div className="mt-6 col-span-6 sm:col-span-3">
                        <label
                          className="block text-sm font-medium text-gray-700 leading-5"
                          htmlFor="country"
                        >
                          LED type
                        </label>
                        <select
                          className={`mt-1 block form-select w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${disableClass}`}
                          disabled={disableCustom}
                          id="country"
                          onChange={(e) => {
                            setConfig({
                              ...config,
                              ledType: e.target.value,
                            });
                          }}
                          value={config.ledType}
                        >
                          {["APA102", "WS2812B"].map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
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
