import compact from "lodash/compact";
import React from "react";
import { Link } from "react-router-dom";

const Header = ({ title, sections, subtitle, actions, className }) => {
  return (
    <div
      className={classnames(
        "flex dark-mode:bg-gray-800 dark-mode:text-white flex-row",
        "h-20 border-b dark-mode:border-gray-700",
        "flex-shrink-0 flex-grow-0",
        className
      )}
    >
      <div
        className="flex flex-col justify-center flex-grow px-6 py-5 "
        style={{ WebkitAppRegion: "drag" }}
      >
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <span className="flex flex-row items-center text-xl text-gray-900 leading-7 dark-mode:text-white sm:leading-9 sm:truncate">
              {compact(sections).map(({ title, to }, i) => (
                <React.Fragment key={i}>
                  <Link
                    className="flex flex-row items-center text-gray-500 dark-mode:text-white hover:text-gray-700 dark-mode:hover:text-gray-300 transition duration-150 ease-in-out"
                    key={to}
                    to={to}
                  >
                    {title}
                  </Link>
                  {i < sections.length && (
                    <svg
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      fill="currentColor"
                      height="40"
                      viewBox="0 0 20 20"
                      width="40"
                    >
                      <path
                        clipRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        fillRule="evenodd"
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
        <div className="flex items-center flex-shrink-0 pr-8 ml-auto space-x-2">
          {compact(actions).map((action, i) => {
            const { title, onClick, className, ...rest } = action;

            if (!title) return <div key={i}>{action}</div>;

            return (
              <span className="ml-2 shadow-sm rounded-md" key={title}>
                <button
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md bg-white hover:text-gray-800 hover:bg-purple-50 ()):outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out ${className}`}
                  onClick={onClick}
                  type="button"
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
