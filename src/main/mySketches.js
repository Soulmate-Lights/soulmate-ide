import Header from "~/components/Header";
import _ from "lodash";
import moment from "moment";
import { Link } from "react-router-dom";
import history from "~/utils/history";
import Sketch from "~/components/sketch";
import SketchesContainer from "~/containers/sketches";

const MySketches = () => {
  const {
    sketches,
    createSketch,
    fetchSketches,
  } = SketchesContainer.useContainer();
  const [newSketchName, setNewSketchName] = useState("");
  const [creating, setCreating] = useState(false);

  let groupedSketches = _.groupBy(sketches, (sketch) => {
    return moment(sketch.updated_at).startOf("week").toDate();
  });

  const sortObjectKeys = (obj) =>
    _.sortBy(Object.keys(obj), (key) => -moment(key)).reduce((acc, key) => {
      acc[key] = obj[key];
      return acc;
    }, {});

  groupedSketches = sortObjectKeys(groupedSketches);

  useEffect(() => {
    fetchSketches();
  }, []);

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
                className="form-input block w-full sm:text-sm sm:leading-3 rounded-r-none"
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

      <div className="px-4 py-4 overflow-auto flex flex-col flex-shrink">
        {_.map(Object.keys(groupedSketches).sort(), (key) => {
          const sketches = groupedSketches[key];
          return (
            <div key={key}>
              <h3 className="mb-2 text-lg">
                {moment(sketches[0].updated_at).fromNow()}
              </h3>
              <div className="flex flex-row flex-wrap">
                {sketches?.map((sketch) => (
                  <Link key={sketch.id} to={`/my-patterns/${sketch.id}`}>
                    <Sketch sketch={sketch} className="mr-4 mb-4" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MySketches;
