import "./progress.pcss";

import compact from "lodash/compact";
import uniqBy from "lodash/uniqBy";
import { AiFillCheckCircle } from "react-icons/ai";

import Header from "~/components/Header";
import Sketch from "~/components/sketch";
import SketchesContainer from "~/containers/sketches";
import Soulmates from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";

import FlashButton from "./components/flashButton";

const Flash = () => {
  const { flashing } = Soulmates.useContainer();
  const { userDetails } = UserContainer.useContainer();
  const { allSketches, sketches } = SketchesContainer.useContainer();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    if (localStorage.selected) {
      try {
        const ids = JSON.parse(localStorage["selected"]);
        setSelected(ids);
      } catch (e) {
        delete localStorage["selected"];
      }
    }
  }, []);

  useEffect(() => {
    localStorage["selected"] = JSON.stringify(selected);
  }, [selected]);

  if (!allSketches) return <Logo className="loading-spinner" />;

  const filteredSketches = allSketches?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedSketches = selected.map((id) =>
    [...(allSketches || []), ...(sketches || [])].find((s) => s.id === id)
  );

  let users = uniqBy(
    filteredSketches?.map((sketch) => sketch.user),
    (user) => user.id
  );

  users = users
    ?.map((u) => ({
      ...u,
      sketches: filteredSketches.filter((s) => s.user.id === u.id),
    }))
    .filter((u) => u.uid !== userDetails.sub);

  const toggle = (sketch) => {
    if (flashing) return;

    if (selected.includes(sketch.id)) {
      setSelected(compact(selected.filter((i) => i !== sketch.id)));
    } else {
      setSelected([...selected, sketch.id]);
    }
  };

  return (
    <div className="relative flex flex-col flex-grow">
      <Header
        actions={[
          <input
            autoFocus
            className="block w-full form-input sm:text-sm sm:leading-3"
            key="search"
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
          />,
        ]}
        title="Flash"
      />

      <div className="flex flex-col flex-grow flex-shrink p-8 overflow-auto">
        <h3 className="mb-2 text-lg">My Sketches</h3>

        <div className="flex flex-row flex-wrap">
          {sketches?.map((sketch) => (
            <div
              className="relative mb-4 mr-4 cursor-pointer"
              key={sketch.id}
              onClick={() => toggle(sketch)}
            >
              <Sketch sketch={sketch} />

              {selected.includes(sketch.id) && (
                <AiFillCheckCircle className="absolute text-lg text-white top-2 right-2" />
              )}
            </div>
          ))}
        </div>

        {users?.map((user) => (
          <div className="pb-4" key={user.id}>
            <h3 className="mb-2 text-lg">{user.name}</h3>
            <div className="flex flex-row flex-wrap">
              {user.sketches?.map((sketch) => (
                <div
                  className="relative mb-4 mr-4 cursor-pointer"
                  key={sketch.id}
                  onClick={() => toggle(sketch)}
                >
                  <Sketch sketch={sketch} />

                  {selected.includes(sketch.id) && (
                    <AiFillCheckCircle className="absolute text-lg text-white top-2 right-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row items-center px-4 py-4 bg-gray-300 border-t border-gray-400">
        <div className="bottom-0 flex flex-col flex-wrap flex-shrink pr-4">
          {selectedSketches.length === 0 && (
            <>Choose up to 20 patterns to upload to your Soulmate.</>
          )}

          {selectedSketches.length > 0 && (
            <div className="bottom-0 flex flex-row flex-wrap items-center flex-shrink leading-none">
              Sketches to upload
              <span className="inline px-2 py-1 ml-1 text-xs text-white bg-gray-400 rounded-full">
                {selectedSketches.length}
              </span>
            </div>
          )}

          <div className="bottom-0 flex flex-row flex-wrap flex-shrink overflow-auto max-h-48">
            {selectedSketches.map((sketch) => (
              <div
                className="relative mt-4 mr-4 text-xs cursor-pointer"
                key={sketch.id}
              >
                <Sketch
                  key={sketch.id}
                  onClick={() => toggle(sketch)}
                  sketch={sketch}
                  width={16}
                />
                <AiFillCheckCircle className="absolute text-lg text-white top-2 right-2" />
              </div>
            ))}
          </div>
        </div>

        <FlashButton
          className="items-end flex-shrink-0 h-full ml-auto"
          selectedSketches={selectedSketches}
        />
      </div>
    </div>
  );
};

export default Flash;
