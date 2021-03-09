import { BsTerminal } from "react-icons/bs";
import { FiAlertCircle, FiSettings } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { RiPlayList2Fill } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";

import SoulmateMenuItem from "~/components/SoulmatesMenu/SoulmateMenuItem";
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
    setSelectedSoulmate,
  } = SoulmatesContainer.useContainer();
  const { isAdmin } = UserContainer.useContainer();

  return (
    <>
      {soulmates?.length > 0 && (
        <>
          <hr className="mx-2 mt-4 app-border" />
          <div className={menuSectionClass}>Choose a Soulmate</div>

          <div>
            {soulmates.map((soulmate, i) => (
              <div
                className={classnames(
                  "px-4 py-2 bg-transparent cursor-pointer dark-mode:hover:bg-gray-800 hover:bg-gray-300 rounded mb-1",
                  {
                    "bg-gray-300 dark-mode:bg-gray-800":
                      soulmate === selectedSoulmate,
                  }
                )}
                key={i}
                onClick={() => {
                  setSelectedSoulmate(
                    soulmate === selectedSoulmate ? undefined : soulmate
                  );
                }}
              >
                <SoulmateMenuItem
                  className="bg-transparent dark-mode:text-white"
                  onSelect={() => {
                    console.log("select");
                    setSelectedSoulmate(
                      soulmate === selectedSoulmate ? undefined : soulmate
                    );
                  }}
                  selected={soulmate === selectedSoulmate}
                  soulmate={soulmate}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {selectedSoulmate && (
        <>
          <hr className="mx-2 mt-4 app-border" />
          <div className={menuSectionClass}>
            <span>{soulmateName(selectedSoulmate)}</span>

            {selectedSoulmate.config && (
              <span className="px-2 ml-auto text-xs text-gray-800 bg-white rounded-lg py-0.5">
                {selectedSoulmate.config.cols} x {selectedSoulmate.config.rows}
              </span>
            )}
          </div>

          {!needsSetup && (
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

          {!needsSetup && (
            <NavLink
              activeClassName={activeLinkClass}
              className={linkClass}
              location={location}
              to="/soulmate"
            >
              <HiOutlineLightningBolt className={iconClass} />
              Edit Patterns
            </NavLink>
          )}

          {isElectron() && (
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
