import { Link } from "react-router-dom";
import compact from "lodash/compact";

const Header = ({ title, sections, actions }) => (
  <div className="p-6">
    <div>
      <nav className="hidden sm:flex items-center text-sm leading-5 font-medium">
        {compact(sections).map(({ title, to }, i) => (
          <>
            <Link
              key={to}
              to={to}
              className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              {title}
            </Link>
            {i < sections.length - 1 && (
              <svg
                className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </>
        ))}
      </nav>
    </div>
    <div className="mt-2 md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
          {title}
        </h2>
      </div>

      {actions && (
        <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
          {compact(actions).map(({ title, onClick, className, ...rest }) => (
            <span key={title} className="shadow-sm rounded-md">
              <button
                onClick={onClick}
                type="button"
                className={`inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 ()):outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out ${className}`}
                {...rest}
              >
                {title}
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default Header;
