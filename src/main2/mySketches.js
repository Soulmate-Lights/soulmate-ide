import Header from "./components/Header";
import history from "~/utils/history";
import Sketch from "./components/sketch";
import SketchesContainer from "./containers/sketches";

const MySketches = ({ mine }) => {
  const { sketches, createSketch } = SketchesContainer.useContainer();
  const [newSketchName, setNewSketchName] = useState("");

  const [creating, setCreating] = useState(false);

  return (
    <div className="flex flex-col flex-grow">
      <Header
        title="My patterns"
        actions={[
          !creating && {
            title: "New sketch",
            onClick: () => setCreating(true),
          },
          creating && (
            <>
              <input
                autoFocus
                onChange={(e) => setNewSketchName(e.target.value)}
                placeholder="Give your sketch a name"
                className="form-input block w-full sm:text-sm sm:leading-5 rounded-r-none"
              />
              <button
                className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
                onClick={async () => {
                  const sketch = await createSketch(newSketchName);
                  history.push(`/my-patterns/${sketch.id}`);
                }}
              >
                Create
              </button>
            </>
          ),
        ]}
      />

      <div className="px-4 py-4 overflow-auto flex-shrink">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sketches?.map((sketch) => (
            <Sketch
              key={sketch.id}
              sketch={sketch}
              to={`/my-patterns/${sketch.id}`}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MySketches;
