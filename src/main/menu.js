import { BsTerminal } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa";
import { FaUsb, FaWifi } from "react-icons/fa";
import {
  FiAlertCircle,
  FiCloud,
  FiFolder,
  FiHome,
  FiSettings,
  FiSmile,
} from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { RiToolsFill } from "react-icons/ri";
import { RiPlayList2Fill } from "react-icons/ri";
import { Link, NavLink, useLocation } from "react-router-dom";

import SoulmatesMenu from "~/components/Simulator/SoulmatesMenu";
import UserDetails from "~/components/userDetails";
import SoulmatesContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";
import isElectron from "~/utils/isElectron";
import soulmateName from "~/utils/soulmateName";

import square from "./Square.jpg";

const iconClass = "mr-3 h-6 w-6 transition ease-in-out duration-150";
const menuSectionClass =
  "group flex items-center px-4 py-2 text-sm leading-5 font-medium rounded-md";
const linkClass = `${menuSectionClass} hover:bg-gray-300 dark-mode:hover:text-white dark-mode:hover:bg-gray-600 transition ease-in-out duration-150`;
const activeLinkClass = `dark-mode:bg-gray-800 dark-mode:hover:bg-gray-800 bg-gray-300`;

const shopUrl = "https://shop.soulmatelights.com/products/square";

const Menu = () => {
  const location = useLocation();
  const { isAdmin } = UserContainer.useContainer();
  const {
    usbConnected,
    soulmates,
    selectedSoulmate,
    needsSetup,
  } = SoulmatesContainer.useContainer();

  return (
    <div
      className={
        "flex flex-shrink-0 border-r bg-gray-200 dark-mode:border-gray-600 dark-mode:bg-gray-700 dark-mode:text-white overflow-"
      }
    >
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-1 h-0">
          <div className="flex flex-col flex-1 pb-4 overflow-auto">
            <div className="flex flex-row items-center flex-grow-0 flex-shrink-0 h-16 px-6 border-b app-border">
              <Logo className="w-6 h-6 mr-2" />

              <span className="flex flex-col flex-shrink">
                <span>
                  Soulmate&nbsp;<span className="opacity-50">IDE</span>
                </span>
              </span>
            </div>

            <nav className="flex-1 mx-2 mt-4 space-y-2">
              <NavLink
                activeClassName={activeLinkClass}
                className={linkClass}
                exact
                location={location}
                to="/"
              >
                <FiHome className={iconClass} />
                Home
              </NavLink>

              <NavLink
                activeClassName={activeLinkClass}
                className={linkClass}
                exact
                location={location}
                tag={Link}
                to="/tutorial"
              >
                <FiSmile className={iconClass} />
                Tutorial
              </NavLink>

              <hr className="mx-2 mt-4 app-border" />

              <div className={menuSectionClass}>Patterns</div>

              <NavLink
                activeClassName={activeLinkClass}
                className={linkClass}
                location={location}
                to="/my-patterns"
              >
                <FiFolder className={iconClass} />
                My Patterns
              </NavLink>

              <NavLink
                activeClassName={activeLinkClass}
                className={linkClass}
                location={location}
                to="/gallery"
              >
                <FiCloud className={iconClass} />
                Gallery
              </NavLink>

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
                        menuClassName="top-full right-0 w-48"
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

              {isElectron() && usbConnected && !needsSetup && (
                <>
                  <NavLink
                    activeClassName={activeLinkClass}
                    className={linkClass}
                    location={location}
                    to="/console"
                  >
                    <BsTerminal className={iconClass} />
                    Serial Console
                  </NavLink>
                </>
              )}

              {(usbConnected || needsSetup) && (
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

                  {needsSetup ? <>Set up new Soulmate</> : "Change config"}
                </NavLink>
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
            </nav>

            <div className="mt-auto" />

            {isElectron() && usbConnected && (
              <nav className="mx-2 my-2 space-y-1">
                <a
                  className={linkClass}
                  onClick={() => {
                    remote.getCurrentWindow().toggleDevTools();
                    setTimeout(() => {
                      if (!window.loggedIntro) {
                        window.loggedIntro = true;
                        console.log(
                          "%c Welcome to the Soulmate IDE Developer Tools. You're probably here because something's broken.",
                          "background: purple; color: white"
                        );
                        console.log(
                          "%c Email elliott@soulmatelights.com if you get stuck.",
                          "background: purple; color: white"
                        );
                      }
                    });
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <RiToolsFill className={iconClass} />
                  Open Dev Tools
                </a>
              </nav>
            )}

            <div className="space-y-4">
              <a
                className="flex flex-col flex-shrink mx-4 mt-auto mb-4 overflow-hidden text-xs bg-gray-300 border rounded-lg dark-mode:bg-gray-800 align-center dark-mode:border-gray-600"
                href={shopUrl}
                onClick={(e) => {
                  if (isElectron()) {
                    e.preventDefault();
                    electron.shell.openExternal(shopUrl);
                  }
                }}
                rel="noopener noreferrer"
                style={{ minHeight: 88 }}
                target="_blank"
              >
                <div
                  className="flex-shrink min-h-0 bg-center bg-cover"
                  style={{ backgroundImage: `url(${square})` }}
                >
                  <br />
                  <br />
                  <br />
                  <br />
                </div>
                <div className="flex-shrink-0 p-2 text-center">
                  <p className="font-semibold">Buy a Soulmate Square!</p>
                  <p className="font-light">$149 + shipping</p>
                </div>
              </a>
            </div>
          </div>

          <UserDetails className="border-t dark-mode:border-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default Menu;
