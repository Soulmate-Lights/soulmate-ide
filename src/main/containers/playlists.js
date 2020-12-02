import useSWR, { mutate } from "swr";
import { createContainer } from "unstated-next";

import UserContainer from "~/containers/user";

import { url } from "./config";

const PLAYLISTS_URL = url("/playlists");

const fetcher = (url) => {
  console.log(url);
  const { token } = UserContainer.useContainer();
  alert(token);
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((d) => d.json);
};

const PlaylistContainer = createContainer(() => {
  const { data, isValidating, error } = useSWR(PLAYLISTS_URL, fetcher);

  const models = ["square"];

  const createPlaylist = (name, model, build) => {
    const body = new FormData();
    body.append("build", build, "playlist.bin");
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

  const destroyPlaylist = (id) => {
    fetch(url(`/playlists/${id}`), { method: "DELETE" }).then((response) => {
      mutate(PLAYLISTS_URL);
      return response.json();
    });
  };

  return {
    models,
    data,
    createPlaylist,
    destroyPlaylist,
    isValidating,
    error,
  };
});

export default PlaylistContainer;
