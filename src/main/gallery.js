import Header from "~/components/Header";
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
          {users.map((user) => (
            <li key={user.id} className="border-b">
              <Link
                to={`/user/${user.id}`}
                className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
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
                    <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                      <div className="flex flex-col justify-center">
                        <div className="text-sm leading-5 font-medium text-gray-800 truncate">
                          {user.name}
                        </div>
                        <div className="mt-2 flex items-center text-sm leading-5 text-gray-500">
                          <span className="truncate">
                            {user.sketches.length} pattern
                            {user.sketches.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="hidden md:flex flex-row overflow-auto">
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

      {/* <div className="p-8 overflow-auto flex flex-col flex-grow flex-shrink bg-white dark-mode:bg-gray-900 dark-mode:text-white">
        {users?.map((user) => (
          <div className="pb-4" key={user.id}>
            <h3 className="mb-2 text-lg flex flex-row items-center">
              <img className="mr-2 w-10 h-10 rounded-full" src={user.image} />
              {user.name}
            </h3>
            <ul className="flex flex-row flex-wrap">
              {user.sketches?.map((sketch) => (
                <Link
                  key={sketch.id}
                  to={
                    // mine ? `/my-patterns/${sketch.id}` : `/gallery/${sketch.id}`
                    `/user/${user.id}`
                  }
                >
                  <Sketch sketch={sketch} width={14} className="mr-4 mb-4" />
                </Link>
              ))}
            </ul>
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default Gallery;
