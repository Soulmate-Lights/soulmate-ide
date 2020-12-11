import startCase from "lodash/startCase";
import { BiCloudDownload } from "react-icons/bi";
import { FaChevronUp } from "react-icons/fa";
import { Link } from "react-router-dom";

import ConfigContainer from "~/containers/config";
import NotificationsContainer from "~/containers/notifications";
import Soulmates from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";

import SoulmatesMenu from "./Simulator/SoulmatesMenu";

const configButtonClassName =
  "text-center py-0 px-6 flex flex-col border border-transparent rounded-md rounded-r-none text-white bg-gray-800 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150 text-xs items-center justify-center leading-snug h-15";

const flashButtonClassName =
  "inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-purple-600  focus:outline-none focus:border-purple-700 focus:shadow-outline-purple active:bg-purple-700 transition ease-in-out duration-150 h-15 justify-center";

const FlashButton = ({ selectedSketches, disabled = false, className }) => {
  const { type, config } = ConfigContainer.useContainer();
  const { isAdmin } = UserContainer.useContainer();
  const {
    flashSketches,
    soulmateLoading,
    flashing,
    getBuild,
    usbFlashingPercentage,
    name,
    port,
    selectedSoulmate,
  } = Soulmates.useContainer();
  const notificationsContainer = NotificationsContainer.useContainer();

  const flash = async () => {
    const result = await flashSketches(selectedSketches, config);
    if (!result) {
      notificationsContainer.notify("Error flashing!", "error");
    }
  };

  const download = async () => {
    const build = await getBuild(selectedSketches, config);
    const destination = await remote.dialog.showSaveDialog(
      remote.getCurrentWindow(),
      { defaultPath: "Firmware.bin" }
    );

    remote.require("fs").copyFile(build, destination.filePath, (err) => {
      if (err) return console.error(err);
      console.log("success!");
    });
  };

  const disableFlashButton =
    !selectedSoulmate &&
    (selectedSketches.length === 0 ||
      flashing ||
      soulmateLoading ||
      disabled ||
      !port);
  const showConfigButton =
    !soulmateLoading && !flashing && (port || selectedSoulmate);

  let text;
  if (soulmateLoading) {
    text = "Loading...";
  } else if (!port && !selectedSoulmate) {
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
        <Logo className="w-6 h-6 mr-4 spinner" />
        Building...
      </span>
    );
  } else {
    text = `Flash to ${selectedSoulmate?.name || name}`;
  }

  return (
    <div
      className={classnames(
        className,
        "flex space-x-4 items-center justify-end"
      )}
    >
      <div className="flex flex-row items-center block">
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
            "rounded-r-none": true,
            "cursor-auto": disableFlashButton,
            "hover:bg-purple-500": !disableFlashButton,
            "flex-grow-0": true,
            "whitespace-pre": true,
          })}
          disabled={disableFlashButton}
          onClick={flash}
          type="button"
        >
          {text}
        </button>

        <SoulmatesMenu
          button={
            <button
              className={classnames(flashButtonClassName, {
                "rounded-l-none": true,
                "cursor-auto": disableFlashButton,
                "hover:bg-purple-500": true,
                "bg-purple-800": true,
                "whitespace-pre": true,
              })}
              type="button"
            >
              <FaChevronUp />
            </button>
          }
          buttonClassName="bg-purple-500 text-white"
          menuClassName="bottom-full mb-2"
          text="Flash to"
        />
      </div>

      {isAdmin() && (
        <button
          className={classnames(flashButtonClassName, "space-x-2", {
            "cursor-auto": disableFlashButton,
            "hover:bg-purple-700": !disableFlashButton,
            "bg-purple-700": !disableFlashButton,
            "whitespace-pre": true,
          })}
          disabled={disableFlashButton}
          onClick={download}
          type="button"
        >
          <BiCloudDownload className="w-8 h-8" />
          <span>Download build</span>
        </button>
      )}
    </div>
  );
};

export default FlashButton;
