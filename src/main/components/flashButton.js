import startCase from "lodash/startCase";
import { Link } from "react-router-dom";

import ConfigContainer from "~/containers/config";
import NotificationsContainer from "~/containers/notifications";
import Soulmates from "~/containers/soulmates";
import Logo from "~/images/logo.svg";

const configButtonClassName =
  "text-center py-0 px-6 flex flex-col border border-transparent rounded-md rounded-r-none text-white bg-gray-800 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150 text-xs items-center justify-center leading-snug h-15";

const flashButtonClassName =
  "inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600  focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 h-15 flex-grow justify-center";

const FlashButton = ({ selectedSketches, disabled = false, className }) => {
  const notificationsContainer = NotificationsContainer.useContainer();

  const flash = async () => {
    const result = await flashSketches(selectedSketches, config);
    if (!result) {
      notificationsContainer.notify("Error flashing!", "error");
    }
  };

  const { type, config } = ConfigContainer.useContainer();
  const {
    flashSketches,
    soulmateLoading,
    flashing,
    usbFlashingPercentage,
    name,
    port,
  } = Soulmates.useContainer();

  const disableFlashButton =
    selectedSketches.length === 0 ||
    flashing ||
    soulmateLoading ||
    disabled ||
    !port;
  const showConfigButton = !soulmateLoading && !flashing && port;

  let text;
  if (soulmateLoading) {
    text = "Loading...";
  } else if (!port) {
    text = "No soulmate connected";
  } else if (usbFlashingPercentage >= 0) {
    text = (
      <progress
        className="my-2 usb-flash"
        max="100"
        value={usbFlashingPercentage}
      >
        {usbFlashingPercentage}%{" "}
      </progress>
    );
  } else if (flashing && usbFlashingPercentage === undefined) {
    text = (
      <span className="flex flex-row items-center">
        <Logo className="w-4 h-4 mr-4 spinner" />
        Building...
      </span>
    );
  } else {
    text = `Flash to ${name}`;
  }

  return (
    <div
      className={classnames(className, "flex", {
        "opacity-50": disableFlashButton,
      })}
    >
      {showConfigButton && (
        <Link className={configButtonClassName} to="/config">
          {soulmateLoading ? (
            "Loading..."
          ) : (
            <>
              <span>{startCase(type)}</span>
              <span>
                {config.rows} x {config.cols}
              </span>
            </>
          )}
        </Link>
      )}
      <button
        className={classnames(flashButtonClassName, {
          "rounded-l-none": showConfigButton && !soulmateLoading,
          "cursor-auto": disableFlashButton,
          "hover:bg-indigo-500": !disableFlashButton,
        })}
        disabled={disableFlashButton}
        onClick={flash}
        type="button"
      >
        {text}
      </button>
    </div>
  );
};

export default FlashButton;
