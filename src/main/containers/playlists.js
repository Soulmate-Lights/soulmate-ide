import useSWR, { mutate } from "swr";
import { createContainer } from "unstated-next";

import UserContainer from "~/containers/user";

import { url } from "./config";

const PLAYLISTS_URL = url("/playlists");

const PlaylistContainer = createContainer(() => {
  const { token } = UserContainer.useContainer();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }

  const fetcher = (url) => {
    return fetch(url, {
      headers,
    }).then((d) => d.json());
  };

  const { data: playlists, isValidating, error } = useSWR(
    PLAYLISTS_URL,
    fetcher
  );

  const models = ["square"];

  const createPlaylist = (name, model) => {
    return fetch(PLAYLISTS_URL, {
      method: "POST",
      body: JSON.stringify({ model, name }),
      headers,
    }).then((response) => {
      mutate(PLAYLISTS_URL);
      return response.json();
    });
  };

  const savePlaylist = (id, data) => {
    fetch(url(`/playlists/${id}`), {
      method: "PUT",
      body: JSON.stringify(data),
      headers,
    }).then(() => {
      mutate(PLAYLISTS_URL);
    });
  };

  const destroyPlaylist = (id) => {
    fetch(url(`/playlists/${id}`), { method: "DELETE", headers }).then((response) => {
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
