import { Link } from "react-router-dom";
import React from "react";
import compact from "lodash/compact";

const Header = ({ title, sections, subtitle, actions }) => (
  <div className="px-4 py-4 border-b flex">
    <div className="flex flex-col">
      <nav className="hidden sm:flex items-center text-xs leading-1 font-sm"></nav>

      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate flex flex-row items-center">
            {compact(sections).map(({ title, to }, i) => (
              <React.Fragment key={i}>
                <Link
                  key={to}
                  to={to}
                  className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
                >
                  {title}
                </Link>
                {i < sections.length - 1 && (
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
          </h2>

          <h3>{subtitle}</h3>
        </div>
      </div>
    </div>

    {actions && (
      <div className="flex flex-shrink-0 ml-auto items-center">
        {compact(actions).map((action) => {
          const { title, onClick, className, ...rest } = action;

          if (!title) return action;

          return (
            <span key={title} className="shadow-sm rounded-md ml-2">
              <button
                onClick={onClick}
                type="button"
                className={`inline-flex items-center px-4 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 ()):outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out ${className}`}
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

export default Header;
