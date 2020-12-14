import useSWR, { mutate } from "swr";
import { createContainer } from "unstated-next";

import UserContainer from "~/containers/user";

import { url } from "./config";

const PLAYLISTS_URL = url("/my-playlists");

const PlaylistContainer = createContainer(() => {
  const models = ["square"];

  const { token } = UserContainer.useContainer();
  const bearer = useRef();

  useEffect(() => {
    bearer.current = token;
  }, [token]);

  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistSketches, setNewPlaylistSketches] = useState([]);

  const headers = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${bearer.current}`,
  });

  const { data: playlists, isValidating, error } = useSWR(
    PLAYLISTS_URL,
    (url) => {
      return fetch(url, {
        headers: headers(),
      }).then((d) => d.json());
    }
  );

  useEffect(() => {
    mutate(PLAYLISTS_URL);
  }, [token]);

  const createPlaylist = (name, model, sketches) => {
    return fetch(PLAYLISTS_URL, {
      method: "POST",
      body: JSON.stringify({ model, name, sketches }),
      headers: headers(),
    }).then((response) => {
      mutate(PLAYLISTS_URL);
      return response.json();
    });
  };

  const savePlaylist = (id, data, build) => {
    var formData = new FormData();
    formData.append("sketches", JSON.stringify(data.sketches));

    if (build)
      formData.append(
        "build",
        new Blob([fs.readFileSync(build)]),
        "firmware.bin"
      );

    fetch(url(`/my-playlists/${id}`), {
      method: "PUT",
      body: formData,
      headers: { Authorization: `Bearer ${bearer.current}` },
    }).then(() => {
      mutate(PLAYLISTS_URL);
    });
  };

  const destroyPlaylist = (id) => {
    fetch(url(`/my-playlists/${id}`), {
      method: "DELETE",
      headers: headers(),
    }).then((response) => {
      mutate(PLAYLISTS_URL);
      return response.json();
    });
  };

  const unpublishPlaylist = (id) => {
    fetch(url(`/my-playlists/${id}/unpublish`), {
      method: "POST",
      headers: headers(),
    }).then((response) => {
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
    newPlaylistName,
    setNewPlaylistName,
    newPlaylistSketches,
    setNewPlaylistSketches,
    unpublishPlaylist,
  };
});

export default PlaylistContainer;
