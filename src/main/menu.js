import classnames from "classnames";
import { FaUsb } from "react-icons/fa";
import { FiCloud, FiFolder, FiHome, FiSettings, FiSmile } from "react-icons/fi";
import { Link, NavLink, useLocation } from "react-router-dom";

import Logo from "~/images/Logo.svg";
import isElectron from "~/utils/isElectron";

import UserDetails from "./userDetails";

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

const Menu = () => {
  const location = useLocation();

  return (
    <div
      className={classnames(
        "flex flex-shrink-0 border-r",
        "bg-gray-200",
        "dark-mode:border-gray-600 dark-mode:bg-gray-700 dark-mode:text-white"
      )}
    >
      <div className="flex flex-col w-72">
        <div className="flex flex-col flex-1 h-0">
          <div
            className={classnames("flex-1 flex flex-col pb-4 overflow-y-auto")}
          >
            <div className="flex flex-row items-center h-24 px-6 py-4 border-b dark-mode:border-gray-600">
              <Logo className="w-10 h-10 mr-4" />

              <span className="flex flex-col">
                <span>
                  Soulmate&nbsp;<span className="opacity-50">IDE</span>
                </span>
                <span className="text-sm opacity-50">FastLED Emulator</span>
              </span>
            </div>

            <nav className="flex-1 mx-2 mt-4 space-y-1">
              <NavLink
                to="/"
                location={location}
                exact
                activeClassName={activeLinkClass}
                className={linkClass}
              >
                <FiHome className={iconClass} />
                Home
              </NavLink>

              <NavLink
                tag={Link}
                to="/tutorial"
                location={location}
                exact
                activeClassName={activeLinkClass}
                className={linkClass}
              >
                <FiSmile className={iconClass} />
                Tutorial
              </NavLink>

              <NavLink
                to="/my-patterns"
                location={location}
                activeClassName={activeLinkClass}
                className={linkClass}
              >
                <FiFolder className={iconClass} />
                My Patterns
              </NavLink>

              <NavLink
                to="/gallery"
                location={location}
                activeClassName={activeLinkClass}
                className={linkClass}
              >
                <FiCloud className={iconClass} />
                Gallery
              </NavLink>

              {isElectron() && (
                <NavLink
                  to="/flash"
                  disabled
                  location={location}
                  activeClassName={activeLinkClass}
                  className={linkClass}
                >
                  <FaUsb className={iconClass} />
                  USB Upload
                </NavLink>
              )}

              <NavLink
                to="/config"
                disabled
                location={location}
                activeClassName={activeLinkClass}
                className={linkClass}
              >
                <FiSettings className={iconClass} />
                Config
              </NavLink>
            </nav>
          </div>

          <UserDetails className={`border-t dark-mode:border-gray-600`} />
        </div>
      </div>
    </div>
  );
};

export default Menu;
