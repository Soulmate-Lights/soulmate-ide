import { createContainer } from "unstated-next";

const PlaylistContainer = createContainer(() => {
  const models = ["square"];
  const [newPlaylistSketches, setNewPlaylistSketches] = useState([]);

  return {
    models,
    newPlaylistSketches,
    setNewPlaylistSketches,
  };
});

export default PlaylistContainer;
