import { FiCloud, FiFolder, FiHome, FiSmile } from "@react-icons";
import { GoSettings } from "@react-icons";
import { RiToolsFill } from "@react-icons";
import { Link, NavLink, useLocation } from "react-router-dom";

import UserDetails from "~/components/userDetails";
import SoulmatesContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";
import isElectron from "~/utils/isElectron";

import SoulmateSection from "./SoulmateSection";
import square from "./Square.jpg";

const iconClass = "mr-3 h-6 w-6 transition ease-in-out duration-150";
const menuSectionClass =
  "group flex items-center px-4 py-2 text-sm leading-5 font-medium rounded-md";
const linkClass = `${menuSectionClass} hover:bg-gray-300 dark-mode:hover:text-white dark-mode:hover:bg-gray-600 transition ease-in-out duration-150`;
const activeLinkClass = `dark-mode:bg-gray-800 dark-mode:hover:bg-gray-800 bg-gray-300`;

const shopUrl = "https://shop.soulmatelights.com/products/square";

const Menu = ({ className }) => {
  const location = useLocation();
  const { usbConnected } = SoulmatesContainer.useContainer();
  const { isAdmin } = UserContainer.useContainer();

  return (
    <div
      className={classnames(
        "flex flex-shrink-0 border-r bg-gray-200 dark-mode:border-gray-600 dark-mode:bg-gray-700 dark-mode:text-white",
        className
      )}
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

              <SoulmateSection />
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

            <div className="mt-4 space-y-4">
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

          {isAdmin() && (
            <nav className="mx-2 mt-4 space-y-2">
              <NavLink
                activeClassName={activeLinkClass}
                className={linkClass}
                exact
                location={location}
                to="/settings"
              >
                <GoSettings className={iconClass} />
                Settings
              </NavLink>
            </nav>
          )}

          <UserDetails className="border-t dark-mode:border-gray-600" />
        </div>
      </div>
    </div>
  );
};

export default Menu;
