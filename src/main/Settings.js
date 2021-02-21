import Header from "./components/Header";
import NetworkContainer from "./containers/network";

const Settings = () => {
  const {
    simulator,
    setSimulator,
    firmware,
    setFirmware,
    appServer,
    setAppServer,
  } = NetworkContainer.useContainer();

  const Options = ({ options, selectedOption, onChange }) => (
    <>
      {options.map((option, i) => (
        <li key={i}>
          <div
            className={classnames(
              "relative flex flex-col p-4 border  md:pl-4 md:pr-6 md:grid md:grid-cols-3",
              {
                "bg-indigo-50 border-indigo-200 z-10":
                  selectedOption === option,
                "border-gray-200": selectedOption === option,
              }
            )}
          >
            <label className="flex items-center text-sm cursor-pointer">
              <input
                aria-describedby="plan-option-pricing-0 plan-option-limit-0"
                checked={selectedOption === option}
                className="w-4 h-4 text-indigo-600 border-gray-300 cursor-pointer focus:ring-indigo-500"
                onChange={() => onChange(option)}
                type="radio"
              />
              <span className="ml-3 font-medium text-gray-900">{option}</span>
            </label>
          </div>
        </li>
      ))}

      <li>
        <div
          className={classnames(
            "relative flex flex-col px-4 border md:pl-4 md:pr-6 md:grid md:grid-cols-3",
            {
              "bg-indigo-50 border-indigo-200 z-10": !options.includes(
                selectedOption
              ),
              "border-gray-200": options.includes(selectedOption),
            }
          )}
        >
          <label
            className="flex items-center text-sm cursor-pointer"
            onClick={() => onChange("")}
          >
            <input
              aria-describedby="plan-option-pricing-0 plan-option-limit-0"
              checked={!options.includes(selectedOption)}
              className="w-4 h-4 mr-4 text-indigo-600 border-gray-300 cursor-pointer focus:ring-indigo-500"
              disabled
              type="radio"
            />
            <input
              aria-describedby="plan-option-pricing-0 plan-option-limit-0"
              className="w-4 w-full h-4 py-4 pl-1 my-2 -ml-2 text-indigo-600 bg-transparent border-gray-300 cursor-pointer focus:ring-indigo-500"
              defaultValue={
                !options.includes(selectedOption) ? selectedOption : undefined
              }
              onBlur={(e) => onChange(e.target.value)}
              placeholder="Something else"
            />
          </label>
        </div>
      </li>
    </>
  );

  return (
    <div className="flex flex-col w-full">
      <Header title="Config" />

      <div className="flex flex-col flex-shrink min-h-0 p-8 overflow-auto">
        <fieldset className="mb-8">
          <h2 className="mb-2">App server</h2>
          <ul className="relative bg-white rounded-md -space-y-px">
            <Options
              onChange={setAppServer}
              options={[
                "https://editor.soulmatelights.com/",
                "http://localhost:3001/",
              ]}
              selectedOption={appServer}
            />
          </ul>
        </fieldset>
        <fieldset className="mb-8">
          <h2 className="mb-2">Simulator</h2>
          <ul className="relative bg-white rounded-md -space-y-px">
            <Options
              onChange={setSimulator}
              options={[
                "https://editor.soulmatelights.com/sketches/build",
                "https://firmware.soulmatelights.com:8082/build",
                "http://localhost:8080/build",
              ]}
              selectedOption={simulator}
            />
          </ul>
        </fieldset>
        <fieldset className="mb-8">
          <h2 className="mb-2">Firmware</h2>
          <ul className="relative bg-white rounded-md -space-y-px">
            <Options
              onChange={setFirmware}
              options={[
                "https://firmware.soulmatelights.com:8083/build",
                "http://localhost:8081//build",
              ]}
              selectedOption={firmware}
            />
          </ul>
        </fieldset>
      </div>
    </div>
  );
};

export default Settings;
