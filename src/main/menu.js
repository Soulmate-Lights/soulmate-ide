import { emojify } from "@twuni/emojify";
import { BsTerminal } from "react-icons/bs";
import { FiCloud, FiFolder, FiHome, FiSettings, FiSmile } from "react-icons/fi";
import { HiOutlineLightningBolt } from "react-icons/hi";
import { RiPlayList2Fill } from "react-icons/ri";
import { Link, NavLink, useLocation } from "react-router-dom";

import SoulmatesContainer from "~/containers/soulmates";
import Logo from "~/images/logo.svg";
import isElectron from "~/utils/isElectron";

import square from "./Square.jpg";
import UserDetails from "./userDetails";

const shopUrl = "https://shop.soulmatelights.com/products/square";

const iconClass = "mr-3 h-6 w-6 transition ease-in-out duration-150";
const linkClass = `group flex items-center px-4 py-2 text-sm leading-5 font-medium rounded-md
hover:bg-gray-300
dark-mode:hover:text-white
dark-mode:hover:bg-gray-600
  transition ease-in-out duration-150`;

const activeLinkClass = `
  dark-mode:bg-gray-800
  dark-mode:hover:bg-gray-800
  bg-gray-300`;

import { FaCog, FaUsb, FaWifi } from "react-icons/fa";

import UserContainer from "~/containers/user";

const Menu = () => {
  const location = useLocation();
  const { isAdmin } = UserContainer.useContainer();
  const {
    usbConnected,
    config,
    selectedSoulmate,
  } = SoulmatesContainer.useContainer();

  return (
    <div
      className={
        "flex flex-shrink-0 border-r bg-gray-200 dark-mode:border-gray-600 dark-mode:bg-gray-700 dark-mode:text-white"
      }
    >
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-1 h-0">
          <div className="flex flex-col flex-1 pb-4 overflow-y-auto">
            <div className="flex flex-row items-center flex-grow-0 flex-shrink-0 h-16 px-6 border-b dark-mode:border-gray-600">
              <Logo className="w-6 h-6 mr-2" />

              <span className="flex flex-col flex-shrink">
                <span>
                  Soulmate&nbsp;<span className="opacity-50">IDE</span>
                </span>
              </span>
            </div>

            <nav className="flex-1 mx-2 mt-4 space-y-1">
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

              <NavLink
                activeClassName={activeLinkClass}
                className={linkClass}
                location={location}
                to="/flash"
              >
                <HiOutlineLightningBolt className={iconClass} />
                Upload
              </NavLink>

              {isElectron() && usbConnected && (
                <NavLink
                  activeClassName={activeLinkClass}
                  className={linkClass}
                  location={location}
                  to="/console"
                >
                  <BsTerminal className={iconClass} />
                  Console
                </NavLink>
              )}

              {isElectron() && (
                <NavLink
                  activeClassName={activeLinkClass}
                  className={linkClass}
                  disabled={!usbConnected}
                  location={location}
                  to="/config"
                >
                  <FiSettings className={iconClass} />
                  Configure
                </NavLink>
              )}

              {isAdmin() && (
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
              )}
            </nav>

            <div className="mt-8" />

            <div className="space-y-4">
              {selectedSoulmate && (
                <div className="flex flex-row flex-wrap items-center mx-4 text-xs border border-gray-200 rounded-lg bg-gray-50 dark-mode:bg-gray-800 dark-mode:border-gray-600">
                  <FaWifi className="w-4 h-4 mx-2 ml-4" />
                  <span className=" py-1 py-2 whitespace-pre">
                    {emojify(selectedSoulmate?.config.name || "WiFi Soulmate")}
                    {selectedSoulmate?.config?.rows &&
                      selectedSoulmate?.config.cols && (
                        <span
                          className="self-end p-1 mx-1 whitespace-pre border rounded opacity-50"
                          style={{ fontSize: 9 }}
                        >
                          {selectedSoulmate?.config?.rows} x{" "}
                          {selectedSoulmate?.config?.cols}
                        </span>
                      )}
                  </span>
                </div>
              )}
              {usbConnected && (
                <div className="flex flex-row flex-wrap items-center  mx-4 text-xs border border-gray-200 rounded-lg bg-gray-50 dark-mode:bg-gray-800 dark-mode:border-gray-600">
                  <FaUsb className="w-4 h-4 mx-2 ml-4" />
                  <span className=" py-1 py-2 whitespace-pre">
                    {emojify(config?.name || "USB Soulmate")}
                    {config?.rows && config.cols && (
                      <span
                        className="p-1 mx-1 whitespace-pre border rounded opacity-50"
                        style={{ fontSize: 9 }}
                      >
                        {config?.rows} x {config?.cols}
                      </span>
                    )}
                  </span>

                  <Link
                    className="px-2 py-2 ml-auto justify-self-end button"
                    to="/config"
                  >
                    <FaCog />
                  </Link>
                </div>
              )}

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

          <UserDetails className={`border-t dark-mode:border-gray-600`} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
