import uniqBy from "lodash/uniqBy";
import { AiFillCheckCircle } from "react-icons/ai";
import compact from "lodash/compact";
import Header from "./components/Header";
import Sketch from "./components/sketch";
import SketchesContainer from "./containers/sketches";

const Flash = () => {
  const { allSketches } = SketchesContainer.useContainer();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  if (!allSketches) return <></>;

  const filteredSketches = allSketches?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  let users = uniqBy(
    filteredSketches?.map((sketch) => sketch.user),
    (user) => user.id
  );

  users = users?.map((u) => ({
    ...u,
    sketches: filteredSketches.filter((s) => s.user.id === u.id),
  }));

  const toggle = (sketch) => {
    if (selected.includes(sketch.id)) {
      setSelected(compact(selected.filter((i) => i !== sketch.id)));
    } else {
      setSelected([...selected, sketch.id]);
    }
  };

  const selectedSketches = allSketches.filter(({ id }) =>
    selected.includes(id)
  );

  return (
    <div className="flex flex-col flex-grow relative">
      <Header
        title="Flash"
        subtitle="Choose some patterns to flash to your Soulmate."
        actions={[
          <input
            key="search"
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="form-input block w-full sm:text-sm sm:leading-3"
          />,
        ]}
      />

      <div className="px-4 py-4 overflow-auto flex flex-col flex-grow flex-shrink">
        {users?.map((user) => (
          <div className="pb-4" key={user.id}>
            <h3 className="mb-2 text-lg">{user.name}</h3>
            <ul className="grid flex-grow grid-cols-1 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
              {user.sketches?.map((sketch) => (
                <div
                  onClick={() => toggle(sketch)}
                  key={sketch.id}
                  className="relative"
                >
                  <Sketch sketch={sketch} />

                  {selected.includes(sketch.id) && (
                    <AiFillCheckCircle className="text-lg absolute top-2 right-2 text-white" />
                  )}
                </div>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {selectedSketches.length > 0 && (
        <div className="bottom-0 w-full flex flex-row p-2 b-top">
          {selectedSketches.map((sketch) => (
            <Sketch
              sketch={sketch}
              key={sketch.id}
              className="w-20 h-20 mr-2"
              onClick={() => toggle(sketch)}
            />
          ))}

          <button
            // onClick={onClick}
            type="button"
            className={`inline-flex items-center px-4 py-1 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 ()):outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out ml-auto`}
          >
            Flash to USB Soulmate
          </button>
        </div>
      )}
    </div>
  );
};

export default Flash;
