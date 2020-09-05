import _ from "lodash";
import moment from "moment";
import { Link } from "react-router-dom";

import Header from "~/components/Header";
import Sketch from "~/components/sketch";
import SketchesContainer from "~/containers/sketches";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";
import history from "~/utils/history";

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
            title: "New pattern",
            onClick: () => setCreating(true),
          },
          creating && (
            <span className="flex flex-row group">
              <input
                autoFocus
                onChange={(e) => setNewSketchName(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && e.target.blur()}
                placeholder="Give your pattern a name"
                className="block w-full h-8 py-2 text-sm rounded-r-none form-input focus:z-10"
              />
              <button
                className="relative inline-flex items-center h-8 px-4 py-2 -ml-px text-sm font-medium text-gray-700 border border-gray-300 outline-none leading-5 rounded-r-md bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150 group-focus:shadow-outline-blue"
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
        <div className="relative flex flex-col items-center justify-center flex-grow p-8 overflow-hidden text-center">
          <Logo className="w-auto h-24 mb-10" />

          <h2 className="text-4xl font-extrabold tracking-tight text-purple-900 leading-10 dark-mode:text-purple-400 sm:text-5xl sm:leading-none md:text-6xl">
            My Sketches
          </h2>
          <p className="max-w-md mx-auto mt-3 text-base text-purple-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Log in to create and save your own patterns.
          </p>

          <div className="max-w-md mx-auto mt-5 sm:flex sm:justify-center md:mt-8">
            <span className="inline-flex shadow rounded-md">
              <a
                href="#none"
                onClick={login}
                className="inline-flex items-center px-4 py-2 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
              >
                Log in
              </a>
            </span>
          </div>
        </div>
      )}

      {userDetails && (
        <div className="flex flex-col flex-grow flex-shrink p-8 overflow-auto">
          {!sketches && <Logo className="loading-spinner" />}
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
                      <Sketch sketch={sketch} className="mb-4 mr-4" />
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
