import Header from "~/components/Header";
import { Link } from "react-router-dom";
import Logo from "~/images/logo.svg";
import Sketch from "~/components/sketch";
import SketchesContainer from "~/containers/sketches";
import UserContainer from "~/containers/user";
import _ from "lodash";
import history from "~/utils/history";
import moment from "moment";

const MySketches = () => {
  const {
    sketches,
    createSketch,
    fetchSketches,
  } = SketchesContainer.useContainer();
  const { userDetails, login } = UserContainer.useContainer();

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
            <span className="flex flex-row group">
              <input
                autoFocus
                onChange={(e) => setNewSketchName(e.target.value)}
                onBlur={() => {
                  setCreating(false);
                }}
                onKeyDown={(e) => e.key === "Escape" && e.target.blur()}
                placeholder="Give your sketch a name"
                className="form-input block w-full text-sm py-2 rounded-r-none h-8 focus:z-10"
              />
              <button
                className="-ml-px relative inline-flex items-center px-4 py-2 h-8 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150 outline-none
                group-focus:shadow-outline-blue
                "
                onClick={async () => {
                  const sketch = await createSketch(newSketchName);
                  history.push(`/my-patterns/${sketch.id}`);
                }}
              >
                Create
              </button>
            </span>
          ),
        ]}
      />

      {!userDetails && (
        <div className="relative overflow-hidden flex-grow p-6 items-center flex flex-col justify-center text-center">
          <Logo className="h-24 w-auto mb-10" />

          <h2 className="text-4xl tracking-tight leading-10 font-extrabold text-purple-900 dark-mode:text-purple-400 sm:text-5xl sm:leading-none md:text-6xl">
            My Sketches
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-purple-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Log in to create and save your own patterns.
          </p>

          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <span className="inline-flex rounded-md shadow">
              <a
                href="#none"
                onClick={login}
                className="inline-flex items-center px-4 py-2 border border-transparent text-base leading-6 font-medium rounded-md text-purple-600 bg-white hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
              >
                Log in
              </a>
            </span>
          </div>
        </div>
      )}

      {userDetails && (
        <div className="px-4 py-4 overflow-auto flex flex-col flex-shrink bg-white dark-mode:bg-gray-900 dark-mode:text-white">
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
      )}
    </div>
  );
};

export default MySketches;
