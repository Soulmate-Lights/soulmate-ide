import Header from "~/components/Header";
import Logo from "~/images/logo.svg";
import { Link } from "react-router-dom";
import Sketch from "~/components/sketch";
import SketchesContainer from "~/containers/sketches";
import UserContainer from "~/containers/user";
import _ from "lodash";
import uniqBy from "lodash/uniqBy";

const Gallery = () => {
  const { userDetails } = UserContainer.useContainer();
  const { allSketches } = SketchesContainer.useContainer();
  const [search, setSearch] = useState("");

  if (!allSketches) return <></>;

  const filteredSketches = allSketches?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  let users = uniqBy(
    filteredSketches?.map((sketch) => sketch.user),
    (user) => user.id
  );

  users = users.filter((u) => u.uid !== userDetails.sub);

  users = users?.map((u) => ({
    ...u,
    sketches: filteredSketches.filter((s) => s.user.id === u.id),
  }));

  users = _.sortBy(users, (u) => -u.sketches.length);

  return (
    <div className="flex flex-col flex-grow">
      <Header
        title="Gallery"
        actions={[
          <input
            key="search"
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="form-input block w-full sm:text-sm sm:leading-3"
          />,
        ]}
      />

      <div className="p-8 overflow-auto">
        <ul>
          {!users && <Logo className="loading-spinner" />}
          {users.map((user) => (
            <li key={user.id} className="border-b dark-mode:border-gray-800">
              <Link
                to={`/user/${user.id}`}
                className="block hover:bg-gray-50 dark-mode:hover:bg-gray-700 rounded focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
              >
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="min-w-0 flex-1 flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full"
                        src={user.image}
                        alt
                      />
                    </div>
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-3 md:gap-4">
                      <div className="flex flex-col justify-center max-w-10">
                        <div className="text-sm leading-5 font-medium text-gray-800 dark-mode:text-white truncate">
                          {user.name}
                        </div>
                        <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                          <span className="truncate">
                            {user.sketches.length} pattern
                            {user.sketches.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="hidden md:flex flex-row overflow-auto col-span-2">
                        {user.sketches?.map((sketch) => (
                          <Sketch
                            key={sketch.id}
                            sketch={sketch}
                            width={14}
                            className="mr-4 flex-shrink-0"
                            hideTitle
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <svg
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Gallery;
