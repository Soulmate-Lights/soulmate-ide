import useSWR, { mutate } from "swr";
import { createContainer } from "unstated-next";

import UserContainer from "~/containers/user";

import { url } from "./config";

const PLAYLISTS_URL = url("/playlists");

const PlaylistContainer = createContainer(() => {
  const { token } = UserContainer.useContainer();

  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistSketches, setNewPlaylistSketches] = useState([]);

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

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

  const createPlaylist = (name, model, sketches) => {
    return fetch(PLAYLISTS_URL, {
      method: "POST",
      body: JSON.stringify({ model, name, sketches }),
      headers,
    }).then((response) => {
      mutate(PLAYLISTS_URL);
      return response.json();
    });
  };

  const savePlaylist = (id, data, build) => {
    var formData = new FormData();
    formData.append("sketches", JSON.stringify(data.sketches));
    if (build) {
      const contents = fs.readFileSync(build);
      formData.append("build", new Blob([contents]), "firmware.bin");
    }

    fetch(url(`/playlists/${id}`), {
      method: "PUT",
      body: formData,
      headers: { Authorization: `Bearer ${token}` },
    }).then(() => {
      mutate(PLAYLISTS_URL);
    });
  };

  const destroyPlaylist = (id) => {
    fetch(url(`/playlists/${id}`), { method: "DELETE", headers }).then(
      (response) => {
        mutate(PLAYLISTS_URL);
        return response.json();
      }
    );
  };

  return {
    models,
    playlists,
    createPlaylist,
    destroyPlaylist,
    savePlaylist,
    isValidating,
    error,
    newPlaylistName,
    setNewPlaylistName,
    newPlaylistSketches,
    setNewPlaylistSketches,
  };
});

export default PlaylistContainer;
