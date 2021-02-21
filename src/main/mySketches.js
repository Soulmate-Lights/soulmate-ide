import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import Header from "~/components/Header";
import TimeGroupedSketches from "~/components/timeGroupedSketches";
import NetworkContainer from "~/containers/network";
import UserContainer from "~/containers/user";
import useSWR from "~/hooks/useSwr";
import Logo from "~/images/logo.svg";
import history from "~/utils/history";
import { SKETCHES_PATH } from "~/utils/network";

const MySketches = () => {
  const { post } = NetworkContainer.useContainer();
  const { data: sketches, mutate } = useSWR(SKETCHES_PATH);
  const { userDetails, login } = UserContainer.useContainer();
  const [newSketchName, setNewSketchName] = useState("");
  const [creating, setCreating] = useState(false);
  const [loading, setLoading] = useState(false);

  const createSketch = async (name) => {
    const newSketch = await post("/sketches/create", { name });
    mutate();
    return newSketch;
  };

  const createSketchFromName = async () => {
    setLoading(true);
    const sketch = await createSketch(newSketchName);
    history.push(`/my-patterns/${sketch.id}`);
  };

  return (
    <div className="flex flex-col flex-grow">
      <Helmet>
        <title>My Sketches</title>
      </Helmet>
      <Header
        actions={[
          !creating && {
            title: "New pattern",
            onClick: () => setCreating(true),
          },
          creating && !loading && (
            <span className="flex flex-row group">
              <input
                autoFocus
                className="block w-full h-8 py-2 text-sm rounded-r-none form-input focus:z-10"
                onBlur={() => setTimeout(() => setCreating(false), 1000)}
                onChange={(e) => setNewSketchName(e.target.value)}
                onKeyDown={async (e) => {
                  const { key } = e;
                  if (key === "Escape") e.target.blur();
                  if (key === "Enter" && e.target.value) createSketchFromName();
                }}
                placeholder="Give your pattern a name"
              />
              <button
                className="relative inline-flex items-center h-8 px-4 py-2 -ml-px text-sm font-medium text-gray-700 border border-gray-300 outline-none leading-5 rounded-r-md bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150 group-focus:shadow-outline-blue"
                onClick={createSketchFromName}
              >
                Create
              </button>
            </span>
          ),
          creating && loading && <Logo className="loading-spinner" />,
        ]}
        title="My patterns"
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
              <Link
                className="inline-flex items-center px-4 py-2 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                onClick={login}
                to="/my-patterns"
              >
                Log in
              </Link>
            </span>
          </div>
        </div>
      )}

      {userDetails && <TimeGroupedSketches mine sketches={sketches} />}
    </div>
  );
};

export default MySketches;
