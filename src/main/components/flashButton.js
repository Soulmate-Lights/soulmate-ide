import startCase from "lodash/startCase";
import { BiCloudDownload } from "react-icons/bi";
import { FaChevronUp } from "react-icons/fa";
import { RiPlayList2Fill } from "react-icons/ri";
import { Link } from "react-router-dom";

import ConfigContainer from "~/containers/config";
import NotificationsContainer from "~/containers/notifications";
import Soulmates from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";

import SoulmatesMenu from "./Simulator/SoulmatesMenu";

const configButtonClassName =
  "footer-button py-0 px-6 flex flex-col border border-transparent rounded-md rounded-r-none text-white bg-gray-800 focus:outline-none focus:border-gray-700 focus:shadow-outline-gray active:bg-gray-700 transition ease-in-out duration-150 text-xs items-center justify-center leading-snug h-15";

const FlashButton = ({
  selectedSketches,
  showMenu = true,
  disabled = false,
}) => {
  const { type, config } = ConfigContainer.useContainer();
  const { isAdmin } = UserContainer.useContainer();
  const {
    flashSketches,
    soulmateLoading,
    flashing,
    getBuild,
    usbFlashingPercentage,
    usbConnected,
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
      !usbConnected);
  const showConfigButton =
    !soulmateLoading && !flashing && (usbConnected || selectedSoulmate);

  let text;
  if (soulmateLoading) {
    text = "Loading...";
  } else if (!usbConnected && !selectedSoulmate) {
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
        Uploading...
      </span>
    );
  } else {
    text = `Flash to ${selectedSoulmate?.config.name || "New Soulmate"}`;
  }

  return (
    <div className="flex items-center justify-end flex-shrink w-auto w-full ml-auto space-x-4">
      <div className="flex flex-row items-center flex-grow block">
        <div className="flex flex-row items-start justify-start flex-grow mr-auto space-x-4">
          {isAdmin() && showMenu && (
            <button
              className={classnames("footer-button", "space-x-2", {
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

          {isAdmin() && type === "square" && (
            <button
              className="footer-button"
              onClick={() => {
                history.push({
                  pathname: "/playlists",
                  state: {
                    sketches: selectedSketches,
                  },
                });
              }}
            >
              <RiPlayList2Fill className="w-6 h-6 mr-2" />
              Create playlist
            </button>
          )}
        </div>

        <button
          className={classnames("footer-button", {
            "rounded-r-none": showMenu,
            "cursor-auto": disableFlashButton,
            "hover:bg-purple-500": !disableFlashButton,
            "bg-gray-400": disableFlashButton,
            "flex-grow-0": true,
            "whitespace-pre": true,
          })}
          disabled={disableFlashButton}
          onClick={flash}
          type="button"
        >
          {text}
        </button>

        {showMenu && (
          <SoulmatesMenu
            button={
              <button
                className={classnames(
                  {
                    "rounded-l-none": true,
                    "cursor-auto": disableFlashButton,
                    "hover:bg-purple-500": true,
                    "bg-purple-800": true,
                    "whitespace-pre": true,
                  },
                  "footer-button"
                )}
                type="button"
              >
                <FaChevronUp />
              </button>
            }
            buttonClassName="bg-purple-500 text-white"
            menuClassName="bottom-full mb-2"
            text="Flash to"
          />
        )}
      </div>
    </div>
  );
};

export default FlashButton;
