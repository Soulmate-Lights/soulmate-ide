import FaChevronUp from "@react-icons/all-files/fa/FaChevronUp";
import FaUsb from "@react-icons/all-files/fa/FaUsb";
import FaWifi from "@react-icons/all-files/fa/FaWifi";
import RiPlayList2Fill from "@react-icons/all-files/ri/RiPlayList2Fill";

import SoulmatesMenu from "~/components/SoulmatesMenu";
import NotificationsContainer from "~/containers/notifications";
import Soulmates from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";
import history from "~/utils/history";

import soulmateName from "../utils/soulmateName";

const FlashButton = ({
  selectedSketches,
  showMenu = true,
  disabled = false,
  className,
}) => {
  const { isAdmin } = UserContainer.useContainer();
  const {
    flashSketches,
    soulmateLoading,
    flashing,
    usbFlashingPercentage,
    config,
    selectedSoulmate,
  } = Soulmates.useContainer();
  const { notify } = NotificationsContainer.useContainer();

  const flash = async () => {
    try {
      await flashSketches(selectedSketches, config);
    } catch (e) {
      notify("Error flashing!", "error");
    }
  };

  const disableFlashButton =
    !selectedSoulmate ||
    selectedSketches.length === 0 ||
    flashing ||
    soulmateLoading ||
    disabled;

  let text;
  if (soulmateLoading) {
    text = <Logo className="w-4 spin" />;
  } else if (!selectedSoulmate) {
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
    text = (
      <>
        {selectedSoulmate?.type === "usb" && <FaUsb className="w-6 h-6" />}
        {selectedSoulmate?.type === "http" && <FaWifi className="w-6 h-6" />}
        <span>Upload to {soulmateName(selectedSoulmate)}</span>
      </>
    );
  }

  return (
    <div className="flex items-center justify-end flex-shrink w-auto w-full ml-auto space-x-4">
      <div className="flex flex-row items-center flex-grow block">
        <div className="flex flex-row items-start justify-start flex-grow mr-8 space-x-4">
          {isAdmin() && selectedSketches.length >= 1 && (
            <button
              className="footer-button"
              onClick={() => {
                history.push("/playlists", {
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
          className={classnames(
            "footer-button space-x-4",
            {
              "rounded-r-none": showMenu,
              "cursor-auto": disableFlashButton,
              "hover:bg-purple-500": !disableFlashButton,
              "bg-purple-500": disableFlashButton,
              "flex-grow-0": true,
              "whitespace-pre": true,
            },
            className
          )}
          disabled={disableFlashButton}
          onClick={flash}
          type="button"
        >
          {text}
        </button>

        {showMenu && (
          <SoulmatesMenu
            allowUsb
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
            // menuClassName="bottom-full mb-2"
            text="Upload to..."
          />
        )}
      </div>
    </div>
  );
};

export default FlashButton;
