import startCase from "lodash/startCase";
import { Link } from "react-router-dom";

const configButtonClassName =
  "text-center py-0 px-6 flex flex-col border border-transparent rounded-md rounded-r-none text-white bg-gray-800 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150 text-xs items-center justify-center leading-snug h-15";

const flashButtonClassName =
  "inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150 h-15";

const FlashButton = ({
  usbSoulmate,
  soulmateLoading,
  config,
  onClickFlash,
  selectedSketches,
  type,
  className,
}) => {
  const disableFlashButton =
    !usbSoulmate ||
    selectedSketches.length === 0 ||
    usbSoulmate?.flashing ||
    soulmateLoading;
  const showConfigButton = usbSoulmate && !soulmateLoading;

  const { flashing = false, usbFlashingPercentage } = usbSoulmate || {};

  let text;
  if (soulmateLoading) {
    text = "Loading...";
  } else if (!usbSoulmate) {
    text = "Connect your Soulmate to flash it";
  } else if (usbFlashingPercentage >= 0) {
    text = (
      <progress
        className="usb-flash my-2"
        value={usbFlashingPercentage}
        max="100"
      >
        {usbFlashingPercentage}%{" "}
      </progress>
    );
  } else if (flashing && usbFlashingPercentage === undefined) {
    text = "Building, please wait...";
  } else {
    text = `Flash to ${usbSoulmate.name}`;
  }

  return (
    <div
      className={classnames(
        className,
        "flex align-end ml-auto flex-shrink-0 h-full items-end"
      )}
    >
      {showConfigButton && (
        <Link to="/config" className={configButtonClassName}>
          {soulmateLoading && "Loading..."}

          {!soulmateLoading && (
            <>
              <span>{startCase(type)}</span>
              <span>
                {config.rows} x {config.cols}
              </span>
            </>
          )}
        </Link>
      )}
      <span className="inline-flex">
        <button
          onClick={onClickFlash}
          disabled={disableFlashButton}
          type="button"
          className={classnames(flashButtonClassName, {
            "rounded-l-none": usbSoulmate && !soulmateLoading,
            "opacity-50": disableFlashButton,
            "cursor-auto": disableFlashButton,
          })}
        >
          {text}
        </button>
      </span>
    </div>
  );
};

export default FlashButton;
