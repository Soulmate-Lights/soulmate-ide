import Header from "./components/header";

const Config = () => {
  const [chipType, setChipType] = useState("soulmate");

  const disableCustom = chipType === "soulmate";

  return (
    <div className="w-full flex flex-col">
      <Header title="Config" />

      <div className="p-8 overflow-auto flex flex-col flex-shrink min-h-0">
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Chip config
                </h3>
                <p className="mt-1 text-sm leading-5 text-gray-600">
                  What kind of chip are you using?
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form action="#" method="POST">
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-5 text-gray-700"
                      >
                        Chip type
                      </label>
                      <select
                        value={chipType}
                        onChange={(e) => setChipType(e.target.value)}
                        id="country"
                        className="mt-1 block form-select w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      >
                        <option value="soulmate">
                          Soulmate / M5Stack Atom
                        </option>
                        <option value="atom">M5Stack Atom</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="mt-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 sm:col-span-2 w-full flex-grow">
                          <label
                            htmlFor="company_website"
                            className="block text-sm font-medium leading-5 text-gray-700"
                          >
                            Pins
                          </label>
                          <div className="mt-1 flex w-full">
                            <div className="flex flex-row items-center w-6/12">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 h-10">
                                Data
                              </span>
                              <input
                                disabled={disableCustom}
                                value={32}
                                className="w-24 h-10 mr-8 form-input flex-1 block rounded-none rounded-r-md transition duration-150 ease-in-out sm:text-sm"
                              />
                            </div>
                            <div className="flex flex-row items-center w-6/12">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 h-10">
                                Clock
                              </span>
                              <input
                                disabled={disableCustom}
                                value={32}
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
                            value={4000}
                            disabled={disableCustom}
                            id="first_name"
                            className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          />
                        </div>
                      </div>
                    </div>

                    {/* <div className="mt-6">
                      <label
                        htmlFor="about"
                        className="block text-sm leading-5 font-medium text-gray-700"
                      >
                        About
                      </label>
                      <div className="rounded-md shadow-sm">
                        <textarea
                          id="about"
                          rows={3}
                          className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                          placeholder="you@example.com"
                          defaultValue={""}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Brief description for your profile. URLs are
                        hyperlinked.
                      </p>
                    </div> */}
                    {/* <div className="mt-6">
                      <label className="block text-sm leading-5 font-medium text-gray-700">
                        Photo
                      </label>
                      <div className="mt-2 flex items-center">
                        <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                          <svg
                            className="h-full w-full text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </span>
                        <span className="ml-5 rounded-md shadow-sm">
                          <button
                            type="button"
                            className="py-2 px-3 border border-gray-300 rounded-md text-sm leading-4 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
                          >
                            Change
                          </button>
                        </span>
                      </div>
                    </div> */}
                    {/* <div className="mt-6">
                      <label className="block text-sm leading-5 font-medium text-gray-700">
                        Cover photo
                      </label>
                      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <p className="mt-1 text-sm text-gray-600">
                            <button className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition duration-150 ease-in-out">
                              Upload a file
                            </button>
                            or drag and drop
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  {/* <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <span className="inline-flex rounded-md shadow-sm">
                      <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"
                      >
                        Save
                      </button>
                    </span>
                  </div> */}
                </div>
                <div className="py-3 mt-4 text-right">
                  <button className="py-2 px-8 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-500 focus:outline-none focus:shadow-outline-blue focus:bg-indigo-500 active:bg-indigo-600 transition duration-150 ease-in-out">
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* <div className="hidden sm:block">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div> */}
        {/* <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Personal Information
                </h3>
                <p className="mt-1 text-sm leading-5 text-gray-600">
                  Use a permanent address where you can receive mail.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form action="#" method="POST">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="first_name"
                          className="block text-sm font-medium leading-5 text-gray-700"
                        >
                          First name
                        </label>
                        <input
                          id="first_name"
                          className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="last_name"
                          className="block text-sm font-medium leading-5 text-gray-700"
                        >
                          Last name
                        </label>
                        <input
                          id="last_name"
                          className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-4">
                        <label
                          htmlFor="email_address"
                          className="block text-sm font-medium leading-5 text-gray-700"
                        >
                          Email address
                        </label>
                        <input
                          id="email_address"
                          className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium leading-5 text-gray-700"
                        >
                          Country / Region
                        </label>
                        <select
                          id="country"
                          className="mt-1 block form-select w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        >
                          <option>United States</option>
                          <option>Canada</option>
                          <option>Mexico</option>
                        </select>
                      </div>
                      <div className="col-span-6">
                        <label
                          htmlFor="street_address"
                          className="block text-sm font-medium leading-5 text-gray-700"
                        >
                          Street address
                        </label>
                        <input
                          id="street_address"
                          className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium leading-5 text-gray-700"
                        >
                          City
                        </label>
                        <input
                          id="city"
                          className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium leading-5 text-gray-700"
                        >
                          State / Province
                        </label>
                        <input
                          id="state"
                          className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>
                      <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                        <label
                          htmlFor="postal_code"
                          className="block text-sm font-medium leading-5 text-gray-700"
                        >
                          ZIP / Postal
                        </label>
                        <input
                          id="postal_code"
                          className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button className="py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-500 focus:outline-none focus:shadow-outline-blue active:bg-indigo-600 transition duration-150 ease-in-out">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div> */}
        {/* <div className="hidden sm:block">
          <div className="py-5">
            <div className="border-t border-gray-200" />
          </div>
        </div> */}
        {/* <div className="mt-10 sm:mt-0">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <div className="px-4 sm:px-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Notifications
                </h3>
                <p className="mt-1 text-sm leading-5 text-gray-600">
                  Decide which communications you'd like to receive and how.
                </p>
              </div>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              <form action="#" method="POST">
                <div className="shadow overflow-hidden sm:rounded-md">
                  <div className="px-4 py-5 bg-white sm:p-6">
                    <fieldset>
                      <legend className="text-base leading-6 font-medium text-gray-900">
                        By Email
                      </legend>
                      <div className="mt-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="comments"
                              type="checkbox"
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                          </div>
                          <div className="ml-3 text-sm leading-5">
                            <label
                              htmlFor="comments"
                              className="font-medium text-gray-700"
                            >
                              Comments
                            </label>
                            <p className="text-gray-500">
                              Get notified when someones posts a comment on a
                              posting.
                            </p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="candidates"
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                              />
                            </div>
                            <div className="ml-3 text-sm leading-5">
                              <label
                                htmlFor="candidates"
                                className="font-medium text-gray-700"
                              >
                                Candidates
                              </label>
                              <p className="text-gray-500">
                                Get notified when a candidate applies for a job.
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="offers"
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                              />
                            </div>
                            <div className="ml-3 text-sm leading-5">
                              <label
                                htmlFor="offers"
                                className="font-medium text-gray-700"
                              >
                                Offers
                              </label>
                              <p className="text-gray-500">
                                Get notified when a candidate accepts or rejects
                                an offer.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <fieldset className="mt-6">
                      <legend className="text-base leading-6 font-medium text-gray-900">
                        Push Notifications
                      </legend>
                      <p className="text-sm leading-5 text-gray-500">
                        These are delivered via SMS to your mobile phone.
                      </p>
                      <div className="mt-4">
                        <div className="flex items-center">
                          <input
                            id="push_everything"
                            name="form-input push_notifications"
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                          />
                          <label htmlFor="push_everything" className="ml-3">
                            <span className="block text-sm leading-5 font-medium text-gray-700">
                              Everything
                            </span>
                          </label>
                        </div>
                        <div className="mt-4 flex items-center">
                          <input
                            id="push_email"
                            name="form-input push_notifications"
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                          />
                          <label htmlFor="push_email" className="ml-3">
                            <span className="block text-sm leading-5 font-medium text-gray-700">
                              Same as email
                            </span>
                          </label>
                        </div>
                        <div className="mt-4 flex items-center">
                          <input
                            id="push_nothing"
                            name="form-input push_notifications"
                            type="radio"
                            className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                          />
                          <label htmlFor="push_nothing" className="ml-3">
                            <span className="block text-sm leading-5 font-medium text-gray-700">
                              No push notifications
                            </span>
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button className="py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 shadow-sm hover:bg-indigo-500 focus:outline-none focus:shadow-outline-blue focus:bg-indigo-500 active:bg-indigo-600 transition duration-150 ease-in-out">
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
export default Config;
