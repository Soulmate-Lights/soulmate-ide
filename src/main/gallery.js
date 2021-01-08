import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { Helmet } from "react-helmet";
import { IoPersonCircleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import useSWR from "swr";

import Header from "~/components/Header";
import Sketch from "~/components/sketch";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";
import { emptyCode } from "~/utils/code";
import { ALL_SKETCHES_URL } from "~/utils/urls";

const Gallery = () => {
  const { userDetails } = UserContainer.useContainer();
  const { data: allSketches } = useSWR(ALL_SKETCHES_URL);
  const [search, setSearch] = useState("");

  if (!allSketches || !allSketches.filter)
    return <Logo className="loading-spinner" />;

  const filteredSketches = allSketches
    ?.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter((s) => s.code !== emptyCode);

  let users = uniqBy(
    filteredSketches?.map((sketch) => sketch.user),
    (user) => user?.id
  );

  users = users.sort((u) => u.uid !== userDetails?.sub);

  users = users?.map((u) => ({
    ...u,
    sketches: filteredSketches.filter((s) => s.user?.id === u?.id),
  }));

  users = sortBy(users, (u) => -u.sketches.length);

  return (
    <div className="flex flex-col flex-grow">
      <Helmet>
        <title>Gallery &mdash; Soulmate IDE</title>
      </Helmet>
      <Header
        actions={[
          <input
            autoFocus
            className="block w-full form-input sm:text-sm sm:leading-3"
            key="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />,
        ]}
        title="Gallery"
      />

      {!users && <Logo className="loading-spinner" />}

      <div className="p-4 overflow-auto">
        <ul>
          {users.map((user) => (
            <li className="border-b dark-mode:border-gray-800" key={user.id}>
              <Link
                className="block rounded hover:bg-gray-50 dark-mode:hover:bg-gray-700 focus:outline-none transition duration-150 ease-in-out"
                to={`/gallery/user/${user.id}`}
              >
                <div className="flex items-center px-4 py-4 sm:px-6">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {user.image ? (
                        <img
                          alt="Profile picture"
                          className="w-12 h-12 bg-white rounded-full shadow"
                          src={user.image}
                        />
                      ) : (
                        <IoPersonCircleOutline className="w-12 h-12" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 px-4 md:grid md:grid-cols-3 md:gap-4">
                      <div className="flex flex-col justify-center max-w-10">
                        <div className="text-sm font-medium text-gray-800 truncate leading-5 dark-mode:text-white">
                          {user.name || "Unknown user"}
                        </div>
                        <div className="flex items-center mt-2 text-sm text-gray-500 leading-5">
                          <span className="truncate">
                            {user.sketches.length} pattern
                            {user.sketches.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <div className="flex-row hidden overflow-auto md:flex col-span-2">
                        {user.sketches?.map((sketch) => (
                          <Sketch
                            className="flex-shrink-0 mr-4"
                            key={sketch.id}
                            showTitle={false}
                            sketch={sketch}
                            width={14}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        clipRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        fillRule="evenodd"
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
