import "./progress.pcss";

import compact from "lodash/compact";
import uniqBy from "lodash/uniqBy";
import { AiFillCheckCircle } from "react-icons/ai";

import Header from "~/components/Header";
import Sketch from "~/components/sketch";
import ConfigContainer from "~/containers/config";
import SketchesContainer from "~/containers/sketches";
import Soulmates from "~/containers/soulmates";
import UserContainer from "~/containers/user";

import FlashButton from "./components/flashButton";

const { dialog } = remote;

const showErrorMessage = () => {
  dialog.showMessageBox(null, {
    type: "error",
    buttons: ["OK"],
    defaultId: 2,
    title: "Oops",
    message: "There was an error building these patterns.",
    detail:
      "We couldn't compile all these patterns. One of them might be broken! Please try again with a different selection.",
  });
};

const Flash = () => {
  const { type, config } = ConfigContainer.useContainer();
  const {
    usbSoulmate,
    flashSketches,
    soulmateLoading,
  } = Soulmates.useContainer();
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

  if (!allSketches) return <></>;

  const filteredSketches = allSketches?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedSketches = selected.map((id) =>
    [...allSketches, ...sketches].find((s) => s.id === id)
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
    if (usbSoulmate.flashing) return;

    if (selected.includes(sketch.id)) {
      setSelected(compact(selected.filter((i) => i !== sketch.id)));
    } else {
      setSelected([...selected, sketch.id]);
    }
  };

  const flash = async () => {
    const result = await flashSketches(selectedSketches, config);
    if (!result) showErrorMessage();
  };

  return (
    <div className="flex flex-col flex-grow relative">
      <Header
        title="Flash"
        actions={[
          usbSoulmate && (
            <input
              key="search"
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="form-input block w-full sm:text-sm sm:leading-3"
            />
          ),
        ]}
      />

      <div className="p-8 overflow-auto flex flex-col flex-grow flex-shrink">
        <h3 className="mb-2 text-lg">My Sketches</h3>

        <div className="flex flex-row flex-wrap">
          {sketches?.map((sketch) => (
            <div
              onClick={() => toggle(sketch)}
              key={sketch.id}
              className="relative mr-4 mb-4 cursor-pointer"
            >
              <Sketch sketch={sketch} />

              {selected.includes(sketch.id) && (
                <AiFillCheckCircle className="text-lg absolute top-2 right-2 text-white" />
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
                  onClick={() => toggle(sketch)}
                  key={sketch.id}
                  className="relative mr-4 mb-4 cursor-pointer"
                >
                  <Sketch sketch={sketch} />

                  {selected.includes(sketch.id) && (
                    <AiFillCheckCircle className="text-lg absolute top-2 right-2 text-white" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-row border-t py-4 px-4 bg-gray-300 border-gray-400 items-center">
        <div className="bottom-0 flex flex-col flex-wrap pr-4 flex-shrink">
          {selectedSketches.length === 0 && (
            <>Choose up to 20 patterns to upload to your Soulmate.</>
          )}

          {selectedSketches.length > 0 && (
            <div className="bottom-0 flex flex-row flex-wrap leading-none flex-shrink items-center ">
              Sketches to upload
              <span className="bg-gray-400 rounded-full text-white inline px-2 py-1 ml-1 text-xs">
                {selectedSketches.length}
              </span>
            </div>
          )}

          <div className="bottom-0 flex flex-row flex-wrap flex-shrink max-h-48 overflow-auto">
            {selectedSketches.map((sketch) => (
              <div
                className="cursor-pointer relative mr-4 mt-4 text-xs"
                key={sketch.id}
              >
                <Sketch
                  width={16}
                  sketch={sketch}
                  key={sketch.id}
                  onClick={() => toggle(sketch)}
                />
                <AiFillCheckCircle className="text-lg absolute top-2 right-2 text-white" />
              </div>
            ))}
          </div>
        </div>

        <FlashButton
          usbSoulmate={usbSoulmate}
          soulmateLoading={soulmateLoading}
          config={config}
          type={type}
          selectedSketches={selectedSketches}
          onClickFlash={flash}
        />
      </div>
    </div>
  );
};

export default Flash;
