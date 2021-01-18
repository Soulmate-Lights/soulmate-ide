import { BsTerminal } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import { FaUsb, FaWifi } from "react-icons/fa";
import { FiAlertCircle, FiSettings } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { RiPlayList2Fill } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";

import SoulmatesMenu from "~/components/SoulmatesMenu";
import SoulmatesContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import isElectron from "~/utils/isElectron";
import soulmateName from "~/utils/soulmateName";

const iconClass = "mr-3 h-6 w-6 transition ease-in-out duration-150";
const menuSectionClass = `group flex items-center px-4 py-2 text-sm leading-5 font-medium rounded-md`;
const linkClass = `${menuSectionClass} hover:bg-gray-300 dark-mode:hover:text-white dark-mode:hover:bg-gray-600 transition ease-in-out duration-150`;
const activeLinkClass = `dark-mode:bg-gray-800 dark-mode:hover:bg-gray-800 bg-gray-300`;

const SoulmatesSection = () => {
  const location = useLocation();
  const {
    usbConnected,
    soulmates,
    selectedSoulmate,
    needsSetup,
  } = SoulmatesContainer.useContainer();
  const { isAdmin } = UserContainer.useContainer();
  const usbSelected = selectedSoulmate?.type === "usb";

  return (
    <>
      {soulmates?.length > 0 && (
        <>
          <hr className="mx-2 mt-4 app-border" />
          <div className={menuSectionClass}>
            {selectedSoulmate ? (
              <>
                {soulmateName(selectedSoulmate)}
                {selectedSoulmate.type === "usb" ? (
                  <FaUsb className="w-4 h-4 ml-2 mr-4 text-blue-600" />
                ) : (
                  <FaWifi className="w-4 h-4 ml-2 mr-4 text-blue-600" />
                )}
              </>
            ) : (
              <>Choose a Soulmate</>
            )}

            <div className="flex ml-auto">
              <SoulmatesMenu
                allowUsb
                button={
                  <span className="flex items-center justify-center h-full p-1 ml-auto rounded cursor-pointer hover:bg-white dark-mode:text-white dark-mode:hover:text-gray-800">
                    <FaChevronDown />
                  </span>
                }
                buttonClassName="bg-purple-500 text-white"
                // menuClassName="top-full right-0 w-48"
                text="Connect to..."
              />
            </div>
          </div>

          {selectedSoulmate && !needsSetup && (
            <NavLink
              activeClassName={activeLinkClass}
              className={linkClass}
              location={location}
              to="/flash"
            >
              <HiOutlineLightningBolt className={iconClass} />
              Change Patterns
            </NavLink>
          )}
        </>
      )}

      {selectedSoulmate && isElectron() && (
        <>
          {!needsSetup && usbConnected && (
            <NavLink
              activeClassName={activeLinkClass}
              className={linkClass}
              location={location}
              to="/console"
            >
              <BsTerminal className={iconClass} />
              Serial Console
            </NavLink>
          )}

          <NavLink
            activeClassName={activeLinkClass}
            className={linkClass}
            disabled={!usbConnected}
            location={location}
            to="/config"
          >
            {needsSetup ? (
              <FiAlertCircle
                className={classnames(iconClass, "text-red-500")}
              />
            ) : (
              <FiSettings className={iconClass} />
            )}

            {needsSetup ? "Set up new Soulmate" : "Change config"}
          </NavLink>
        </>
      )}

      {isAdmin() && (
        <>
          <hr className="mx-2 mt-4 app-border" />
          <div className={menuSectionClass}>Playlists</div>
          <NavLink
            activeClassName={activeLinkClass}
            className={linkClass}
            disabled
            location={location}
            to="/playlists"
          >
            <RiPlayList2Fill className={iconClass} />
            Playlists
          </NavLink>
        </>
      )}
    </>
  );
};

export default SoulmatesSection;
