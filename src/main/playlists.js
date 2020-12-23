import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import useSWR from "swr";

import Header from "~/components/Header";
import Sketch from "~/components/sketch";
import ConfigContainer from "~/containers/config";
import Logo from "~/images/logo.svg";
import { post } from "~/utils";
import history from "~/utils/history";
import { PLAYLISTS_URL } from "~/utils/urls";

const Playlists = () => {
  const { state } = useLocation();
  const [sketches, setSketches] = useState(state?.sketches || []);

  const { data: playlists } = useSWR(PLAYLISTS_URL);

  const { playlistTypes } = ConfigContainer.useContainer();

  const [name, setName] = useState("");
  const [modelName, setModelName] = useState(false);
  const [description, setDescription] = useState(undefined);

  const reset = () => setName("");

  const onClickSave = async () => {
    if (!name || !modelName || !description) return;

    post("/my-playlists", {
      name,
      description,
      model: modelName,
      sketches: sketches,
    })
      .then((playlist) => history.push(`/playlists/${playlist.id}`))
      .then(reset)
      .catch((e) => {
        alert("Error creating playlist");
        console.log({ error: e });
      });
  };

  const onClickCancel = () => {
    setSketches([]);
  };

  const groupedPlaylists = _.groupBy(playlists, (p) => p.model_name);

  if (!playlists) return <Logo className="loading-spinner" />;

  return (
    <div className="flex flex-col w-full space-y-8">
      <Header title="Playlists" />
      <div className="flex flex-col items-center w-full space-y-2">
        {sketches.length == 0 && (
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

                                    <p className="text-sm">
                                      {playlist.description}
                                    </p>

                                    <p className="text-xs">
                                      {playlist.url
                                        ? "Published"
                                        : "Not published"}
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
        )}

        {sketches.length > 0 && (
          <>
            <div className="flex flex-row items-start justify-start space-x-2">
              {sketches.map((sketch) => (
                <Sketch className="flex" key={sketch.id} sketch={sketch} />
              ))}
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
                  <button
                    className="inline-flex items-center justify-center w-full px-4 py-2 mt-3 font-medium text-white bg-indigo-600 border border-transparent shadow-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={onClickCancel}
                    type="submit"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Playlists;
