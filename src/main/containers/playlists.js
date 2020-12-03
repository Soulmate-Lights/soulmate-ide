import useSWR, { mutate } from "swr";
import { createContainer } from "unstated-next";

import UserContainer from "~/containers/user";

import { url } from "./config";

const PLAYLISTS_URL = url("/playlists");

const PlaylistContainer = createContainer(() => {
  const { token } = UserContainer.useContainer();

  const fetcher = (url) => {
    return fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((d) => d.json());
  };

  const { data: playlists, isValidating, error } = useSWR(
    PLAYLISTS_URL,
    fetcher
  );

  const models = ["square"];

  const createPlaylist = (name, model) => {
    const body = new FormData();
    // if (build) body.append("build", build, "playlist.bin");
    body.append("model", model);
    body.append("name", name);

    return fetch(PLAYLISTS_URL, {
      method: "POST",
      body,
      headers: {
        token: `Bearer`,
      },
    }).then((response) => {
      mutate(PLAYLISTS_URL);
      return response.json();
    });
  };

  const savePlaylist = (id, data) => {
    fetch(url(`/playlists/${id}`), {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(() => {
      mutate(PLAYLISTS_URL);
    });
  };

  const destroyPlaylist = (id) => {
    fetch(url(`/playlists/${id}`), { method: "DELETE" }).then((response) => {
      mutate(PLAYLISTS_URL);
      return response.json();
    });
  };

  return {
    models,
    playlists,
    createPlaylist,
    destroyPlaylist,
    savePlaylist,
    isValidating,
    error,
  };
});

export default PlaylistContainer;
