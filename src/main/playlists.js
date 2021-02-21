import _ from "lodash";
import React from "react";
import { Link } from "react-router-dom";

import Header from "~/components/Header";
import useSWR, { mutate } from "~/hooks/useSwr";
import Logo from "~/images/logo.svg";
import { fetcher } from "~/utils/network";
import { PLAYLISTS_PATH } from "~/utils/network";

import NewPlaylist from "./newPlaylist";

const Playlists = () => {
  const { data: playlists } = useSWR(PLAYLISTS_PATH, fetcher);
  const groupedPlaylists = _.groupBy(playlists, (p) => p.model_name);
  if (!playlists) return <Logo className="loading-spinner" />;

  return (
    <div className="flex flex-col w-full">
      <Header title="Playlists" />
      <div className="flex flex-col items-center w-full py-8 overflow-auto text-gray-700 space-y-2">
        <div className="w-6/12 align-center rounded-md  space-y-8">
          <ul>
            {Object.entries(groupedPlaylists)?.map(
              ([model_name, playlists]) => (
                <div className="space-y-4" key={model_name}>
                  <span className="dark-mode:text-white">
                    {_.capitalize(model_name)}
                  </span>
                  <ul
                    className="overflow-hidden rounded shadow"
                    key={model_name}
                  >
                    {playlists.map((playlist) => (
                      <li key={playlist.id}>
                        <Link
                          className="block bg-white hover:bg-gray-500 dark-mode:hover:bg-gray-700 hover:text-white focus:outline-none  transition duration-150 ease-in-out"
                          to={`/playlists/${playlist.id}`}
                        >
                          <div className="flex items-center px-4 py-4 sm:px-6">
                            <div className="flex items-center flex-1 min-w-0">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col justify-center max-w-10">
                                  <div className="text-sm font-medium truncate leading-5">
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

          <NewPlaylist />
        </div>
      </div>
    </div>
  );
};

export default Playlists;
