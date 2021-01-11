import compact from "lodash/compact";
import React from "react";
import { BiChevronRight } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export const PersonSection = (user) => (
  <div className="flex flex-row items-center">
    {user.image ? (
      <img
        className={classnames("w-8 h-8 mr-2 bg-white rounded-full", {
          "bg-white": !user.image,
        })}
        src={user.image}
      />
    ) : (
      <IoPersonCircleOutline className="w-8 h-8 mr-2" />
    )}
    {user.name || "Unknown User"}
  </div>
);

const Chevron = () => (
  <BiChevronRight className="flex-shrink-0 w-6 h-6 mx-2 text-gray-400" />
);

const Breadcrumb = ({ sections, title }) => (
  <nav aria-label="Breadcrumb" className="flex">
    <ol className="flex items-center ml-4 ">
      {compact(sections).map(({ title, to }, i) => (
        <li key={i}>
          <div className="flex items-center">
            {i > 0 && <Chevron />}
            <Link
              className="font-normal text-gray-600 dark-mode:text-gray-200 hover:text-gray-700 dark-mode:hover:text-white text-md"
              to={to}
            >
              {title}
            </Link>
          </div>
        </li>
      ))}
      <li>
        <div className="flex items-center text-xl">
          {sections?.length > 0 && <Chevron />}
          <span
            aria-current="page"
            className="flex flex-row items-center font-normal text-gray-600 dark-mode:text-gray-200 "
          >
            {title}
          </span>
        </div>
      </li>
    </ol>
  </nav>
);

const Header = ({ title, sections, subtitle, actions, className }) => {
  return (
    <div
      className={classnames(
        "flex dark-mode:bg-gray-800 dark-mode:text-white flex-row",
        "h-16 border-b dark-mode:border-gray-700",
        "flex-shrink-0 flex-grow-0",
        className
      )}
    >
      <div
        className="flex flex-col justify-center flex-grow px-4 py-5"
        style={{ WebkitAppRegion: "drag" }}
      >
        <Breadcrumb sections={sections} title={title} />
      </div>
      {actions && (
        <div className="flex items-center flex-shrink-0 pr-4 ml-auto space-x-2">
          {compact(actions).map((action, i) => {
            const { title, onClick, className, ...rest } = action;

            if (!title) return <div key={i}>{action}</div>;

            return (
              <span className="ml-2 shadow-sm rounded-md" key={title}>
                <button
                  className={`inline-flex items-center px-4 py-2 border border-gray-300 text-md leading-5 font-medium rounded-md bg-white hover:text-gray-800 hover:bg-purple-50 ()):outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out ${className}`}
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
