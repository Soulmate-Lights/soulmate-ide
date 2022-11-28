import Header from "./components/Header";
import NetworkContainer from "./containers/network";

const Options = ({ options, selectedOption, onChange }) => {
  const optionSelected = options
    .map(({ option }) => option)
    .includes(selectedOption);
  return (
    <>
      {options.map(({ option, name }, i) => (
        <li key={i}>
          <div
            className={classnames(
              "relative flex flex-col p-4 border sm:pl-4 sm:pr-6 sm:grid sm:grid-cols-3",
              {
                "bg-indigo-50 border-indigo-200 z-10":
                  selectedOption === option,
                "border-gray-200": selectedOption !== option,
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
              <span className="ml-3 text-sm font-medium text-gray-900">
                {name}
              </span>
            </label>

            <span className="flex flex-row ml-3 text-sm font-medium text-gray-900 space-x-2">
              {/* <span className="flex-grow-0">
                <UrlValidator url={option} />
              </span> */}
              <span>{option}</span>
            </span>
          </div>
        </li>
      ))}

      <li>
        <div
          className={classnames("relative flex flex-col px-4 border", {
            "bg-indigo-50 border-indigo-200 z-10": !optionSelected,
            "border-gray-200": !optionSelected,
          })}
        >
          <label
            className="flex items-center text-sm cursor-pointer"
            onMouseDown={() => {
              if (optionSelected) onChange("");
            }}
          >
            <input
              aria-describedby="plan-option-pricing-0 plan-option-limit-0"
              checked={!optionSelected}
              className="w-4 h-4 mr-4 text-indigo-600 border-gray-300 cursor-pointer focus:ring-indigo-500"
              disabled
              type="radio"
            />
            <input
              aria-describedby="plan-option-pricing-0 plan-option-limit-0"
              className="w-4 w-full h-4 py-4 pl-1 my-2 -ml-2 text-indigo-600 bg-transparent border-gray-300 cursor-pointer focus:ring-indigo-500"
              onChange={(e) => onChange(e.target.value)}
              placeholder="Something else"
              value={!optionSelected ? selectedOption : ""}
            />
          </label>
        </div>
      </li>
    </>
  );
};

const Settings = () => {
  const {
    simulator,
    setSimulator,
    firmware,
    setFirmware,
    appServer,
    setAppServer,
  } = NetworkContainer.useContainer();

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
                {
                  option: "https://server.soulmatelights.com/",
                  name: "Production",
                },
                { option: "http://localhost:3001/", name: "Local" },
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
                {
                  option: "https://build.soulmatelights.com/hexi",
                  name: "Production",
                },
                { option: "http://localhost:8080/build", name: "Local" },
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
                {
                  option: "https://build.soulmatelights.com/builder",
                  name: "Production",
                },
                { option: "http://localhost:8081/build", name: "Local" },
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
