import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

import PlaylistContainer from "~/containers/playlists";
import UserContainer from "~/containers/user";

const Playlists = () => {
  const {
    data,
    createPlaylist,
    isValidating,
    destroyPlaylist,
  } = PlaylistContainer.useContainer();

  const { token } = UserContainer.useContainer();

  const [file, setFile] = useState();
  const [name, setName] = useState();

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const reset = () => {
    setName("");
    setFile(undefined);
  };

  const onClickSave = () => {
    if (!file || !name) return alert("oops");

    createPlaylist(name, "square", file)
      .then(reset)
      .catch((e) => {
        alert("err");
        console.log({ error: e });
      });
  };

  return (
    <div className="flex flex-col items-center justify-center w-full space-y-8">
      <div className="w-6/12 overflow-hidden bg-white shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {data?.map((playlist) => (
            <li key={playlist.id}>
              <div className="flex items-center px-2 py-4 sm:px-6">
                <div className="flex items-center flex-1 min-w-0">
                  <div className="flex-1 min-w-0 px-4 md:grid md:grid-cols-2 md:gap-4">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {playlist.name}
                    </p>
                  </div>
                </div>
                <div>
                  <button
                    className="inline-flex items-center text-xs font-medium text-white bg-red-600 border border-transparent rounded px-2.5 py-1.5 shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => destroyPlaylist(playlist.id)}
                  >
                    x
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-6/12 bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 leading-6">
            Create a playlist
          </h3>

          <div
            {...getRootProps()}
            className="p-10 border-2 border-dotted align-center"
          >
            {file ? (
              <>
                {file.name} ({file.size} bytes)
              </>
            ) : (
              <div>
                <input {...getInputProps()} />
                Drop a playlist here
              </div>
            )}
          </div>

          <div className="mt-5 sm:flex sm:items-center">
            <div className="w-full max-w-xs">
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
            <button
              className="inline-flex items-center justify-center w-full px-4 py-2 mt-3 font-medium text-white bg-indigo-600 border border-transparent shadow-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClickSave}
              type="submit"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WrappedComponent = () => (
  <PlaylistContainer.Provider>
    <Playlists />
  </PlaylistContainer.Provider>
);

export default WrappedComponent;
