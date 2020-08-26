import { Link } from "react-router-dom";
import history from "~/utils/history";
import React from "react";
import compact from "lodash/compact";
import { useLastLocation } from "react-router-last-location";

const Header = ({ title, sections, subtitle, actions, className }) => {
  const lastLocation = useLastLocation();

  return (
    <div
      className={classnames(
        "flex dark-mode:bg-gray-800 dark-mode:text-white flex-row",
        "h-24 border-b dark-mode:border-gray-700",
        className
      )}
    >
      <div
        className="flex flex-col justify-center flex-grow px-6 py-5 "
        style={{ WebkitAppRegion: "drag" }}
      >
        <div className="md:flex md:items-center md:justify-between">
          <nav className="relative z-0 inline-flex shadow-sm mr-4">
            <button
              disabled={!lastLocation}
              onClick={() => history.go(-1)}
              className={`relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500  transition ease-in-out duration-150 ${
                !lastLocation && "opacity-25"
              }`}
              aria-label="Previous"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </nav>
          <div className="flex-1 min-w-0">
            <span className="text-xl leading-7 text-gray-900 dark-mode:text-white sm:leading-9 sm:truncate flex flex-row items-center">
              {compact(sections).map(({ title, to }, i) => (
                <React.Fragment key={i}>
                  <Link
                    key={to}
                    to={to}
                    className="text-gray-500 dark-mode:text-white hover:text-gray-700 transition duration-150 ease-in-out flex flex-row items-center"
                  >
                    {title}
                  </Link>
                  {i < sections.length && (
                    <svg
                      className="flex-shrink-0 h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      width="40"
                      height="40"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </React.Fragment>
              ))}
              {title}
            </span>

            <h3 className="dark-mode:text-white">{subtitle}</h3>
          </div>
        </div>
      </div>
      {actions && (
        <div className="flex flex-shrink-0 ml-auto items-center pr-8">
          {compact(actions).map((action) => {
            const { title, onClick, className, ...rest } = action;

            if (!title) return action;

            return (
              <span key={title} className="shadow-sm rounded-md ml-2">
                <button
                  onClick={onClick}
                  type="button"
                  className={`inline-flex items-center px-4 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md bg-white hover:text-gray-800 hover:bg-indigo-50 ()):outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out ${className}`}
                  {...rest}
                >
                  {title}
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Header;
