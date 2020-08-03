import { FiCloud, FiFolder, FiHome, FiSmile } from "react-icons/fi";
import { Link, NavLink, useLocation } from "react-router-dom";

import classnames from "classnames";
import history from "~/utils/history";

const iconClass =
  "mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-300 group-focus:text-gray-300 transition ease-in-out duration-150";

const linkClass =
  "group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-300 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition ease-in-out duration-150";

const selectedClass = "bg-gray-700";

const Menu = () => {
  const location = useLocation();

  return (
    <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
      <nav className="mt-5 flex-1 px-2 bg-gray-800 space-y-1">
        <NavLink
          to="/"
          location={location}
          exact
          activeClassName={selectedClass}
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
          activeClassName={selectedClass}
          className={linkClass}
        >
          <FiSmile className={iconClass} />
          Tutorial
        </NavLink>
        <NavLink
          to="/my-patterns"
          location={location}
          exact
          activeClassName={selectedClass}
          className={linkClass}
        >
          <FiFolder className={iconClass} />
          My Patterns
        </NavLink>
        <NavLink
          to="/gallery"
          exact
          location={location}
          activeClassName={selectedClass}
          className={linkClass}
        >
          <FiCloud className={iconClass} />
          Gallery
        </NavLink>
      </nav>
    </div>
  );
};

export default Menu;
