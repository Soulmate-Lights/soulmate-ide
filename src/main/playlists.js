import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";

import Header from "~/components/header";
import ConfigContainer from "~/containers/config";
import PlaylistContainer from "~/containers/playlists";
import history from "~/utils/history";

const Playlists = () => {
  const { playlists, createPlaylist } = PlaylistContainer.useContainer();

  const { playlistTypes } = ConfigContainer.useContainer();

  const [name, setName] = useState("");

  const reset = () => {
    setName("");
  };

  const onClickSave = () => {
    if (!name) return alert("Please choose a name");
    if (!modelName) return alert("Please choose a model type");

    createPlaylist(name, modelName)
      .then((playlist) => history.push(`/playlists/${playlist.id}`))
      .then(reset)
      .catch((e) => {
        alert("err");
        console.log({ error: e });
      });
  };

  const groupedPlaylists = _.groupBy(playlists, (p) => p.model_name);

  const [modelName, setModelName] = useState(false);
  const [description, setDescription] = useState(undefined);

  return (
    <div className="flex flex-col w-full space-y-8">
      <Header title="Playlists" />
      <div className="flex flex-col items-center w-full space-y-2">
        <div className="w-6/12 align-center rounded-md">
          <ul>
            {Object.entries(groupedPlaylists)?.map(
              ([model_name, playlists]) => (
                <div key={model_name}>
                  <span>{_.capitalize(model_name)}</span>
                  <ul
                    className="my-4 overflow-hidden rounded shadow"
                    key={model_name}
                  >
                    {playlists.map((playlist) => (
                      <li key={playlist.id}>
                        <Link
                          className="block bg-white hover:bg-gray-50 dark-mode:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                          to={`/playlists/${playlist.id}`}
                        >
                          <div className="flex items-center px-4 py-4 sm:px-6">
                            <div className="flex items-center flex-1 min-w-0">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col justify-center max-w-10">
                                  <div className="text-sm font-medium text-gray-800 truncate leading-5 dark-mode:text-white">
                                    {playlist.name}
                                  </div>

                                  <p className="text-xs">
                                    {playlist.description}
                                  </p>
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
              )
            )}
          </ul>
        </div>

        <div className="w-6/12 text-gray-900 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 leading-6">
              Create a playlist
            </h3>

            <div>
              <select
                className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                id="location"
                name="location"
                onChange={(e) => setModelName(e.target.value)}
                placeholder="Choose a type"
                value={modelName}
              >
                <option disabled value={false}>
                  Choose a Soulmate type
                </option>
                {playlistTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5 sm:flex sm:items-center">
              <div className="w-full">
                <input
                  className="block w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  id="email"
                  name="email"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Playlist Name"
                  type="text"
                  value={name}
                />
              </div>
            </div>

            <div className="mt-5 sm:flex sm:items-center">
              <div className="w-full">
                <input
                  className="block w-full border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  id="email"
                  name="email"
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Description"
                  type="text"
                  value={description}
                />
              </div>
              <button
                className="inline-flex items-center justify-center w-full px-4 py-2 mt-3 font-medium text-white bg-indigo-600 border border-transparent shadow-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                disabled={!name || !description || !modelName}
                onClick={onClickSave}
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WrappedComponent = () => (
  <PlaylistContainer.Provider>
    <ConfigContainer.Provider>
      <Playlists />
    </ConfigContainer.Provider>
  </PlaylistContainer.Provider>
);

export default WrappedComponent;
