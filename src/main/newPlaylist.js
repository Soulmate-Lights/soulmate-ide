// import useSWR from "swr";

// import Sketch from "~/components/sketch";
// import SketchesContainer from "~/containers/sketches";
import { post } from "~/utils";
import history from "~/utils/history";
import { playlistTypes } from "~/utils/types";
// import { playlistTypes } from "~/utils/types";
// import { ALL_SKETCHES_URL, SKETCHES_URL } from "~/utils/urls";

const NewPlaylist = () => {
  const [name, setName] = useState("");
  const [modelName, setModelName] = useState(false);
  const [description, setDescription] = useState(undefined);

  const onClickSave = async () => {
    if (!name || !modelName || !description) return;

    post("/my-playlists", {
      name,
      description,
      model: modelName,
      sketches: [],
    })
      .then((playlist) => history.push(`/playlists/${playlist.id}`))
      .catch((e) => {
        alert("Error creating playlist");
        console.log({ error: e });
      });
  };

  return (
    <div className="w-full text-gray-900 bg-white shadow sm:rounded-lg">
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
  );
};

export default NewPlaylist;

{
  /* {selectedSketches.length > 0 && (
    <>
      <div className="flex flex-row items-start justify-start space-x-2">
        {selectedSketches.map((sketch) => (
          <Sketch className="flex" key={sketch.id} sketch={sketch} />
        ))}
      </div>


    </>
  )} */
}

// const [sketches, setSketches] = useState(state?.sketches || []);
// const { data: sketches } = useSWR(SKETCHES_URL);
// const { data: allSketches } = useSWR(ALL_SKETCHES_URL);
// const { selected, setSelected } = SketchesContainer.useContainer();

// const selectedSketches = selected.map(
//   (id) =>
//     allSketches?.find((s) => s?.id === id) ||
//     sketches?.find((s) => s?.id === id)
// );

// const [name, setName] = useState("");
// const [modelName, setModelName] = useState(false);
// const [description, setDescription] = useState(undefined);

// const reset = () => setName("");

// const onClickSave = async () => {
//   if (!name || !modelName || !description) return;

//   post("/my-playlists", {
//     name,
//     description,
//     model: modelName,
//     sketches: selectedSketches,
//   })
//     .then((playlist) => history.push(`/playlists/${playlist.id}`))
//     .then(reset)
//     .catch((e) => {
//       alert("Error creating playlist");
//       console.log({ error: e });
//     });
// };

// const onClickCancel = () => {
//   setSelected([]);
// };

// import Sketch from "~/components/sketch";
// import SketchesContainer from "~/containers/sketches";
// import { post } from "~/utils";
// import history from "~/utils/history";

// import { ALL_SKETCHES_URL, SKETCHES_URL } from "~/utils/urls";
