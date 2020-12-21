import "./progress.pcss";

import compact from "lodash/compact";
import uniqBy from "lodash/uniqBy";
import { Suspense } from "react";
import { AiFillCheckCircle } from "react-icons/ai";
import { BsLayoutSidebarInsetReverse } from "react-icons/bs";
import { RiPlayList2Fill } from "react-icons/ri";
import { ResizableBox } from "react-resizable";

import Header from "~/components/Header";
import Sketch from "~/components/sketch";
import ConfigContainer from "~/containers/config";
import Soulmates from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";
import history from "~/utils/history";

import FlashButton from "./components/flashButton";
import PlaylistContainer from "./containers/playlists";
const Console = React.lazy(() => import("./console"));

import useSWR from "swr";

import { ALL_SKETCHES_URL, SKETCHES_URL } from "~/urls";

const Flash = () => {
  const { data: sketches } = useSWR(SKETCHES_URL);
  const { data: allSketches } = useSWR(ALL_SKETCHES_URL);

  const { flashing, usbConnected } = Soulmates.useContainer();
  const { userDetails, isAdmin } = UserContainer.useContainer();
  const { setNewPlaylistSketches } = PlaylistContainer.useContainer();
  const { type } = ConfigContainer.useContainer();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [showConsole, setShowConsole] = useState(false);

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

  const selectedSketches = selected.map(
    (id) =>
      // [...(allSketches || []), ...(sketches || [])].find((s) => s.id === id)
      allSketches.find((s) => s.id === id) || sketches.find((s) => s.id === id)
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
    <div className="flex flex-row flex-grow">
      <div className="relative flex flex-col flex-grow">
        <Header
          actions={[
            <input
              autoFocus
              className="block w-full py-2 form-input sm:text-sm sm:leading-none"
              key="search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
            />,
            usbConnected && {
              title: <BsLayoutSidebarInsetReverse />,
              className: classnames({ "bg-gray-200": showConsole }),
              onClick: () => setShowConsole(!showConsole),
            },
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

        <div className="flex flex-col">
          {selectedSketches.length > 0 && (
            <div className="flex flex-row items-center px-4 py-4 border-t border-gray-300 dark-mode:bg-gray-600 dark-mode:border-gray-700">
              <div className="bottom-0 flex flex-col flex-wrap flex-shrink pr-4">
                <div className="bottom-0 flex flex-row flex-wrap flex-shrink overflow-auto max-h-48">
                  {selectedSketches.map((sketch) => (
                    <div
                      className="relative mr-4 text-xs cursor-pointer"
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
            </div>
          )}

          <div className="flex-shrink-0 w-full p-4 ml-auto border-t border-gray-300 dark-mode:bg-gray-600 dark-mode:border-gray-700">
            <div className="flex items-center justify-end space-x-4">
              <FlashButton selectedSketches={selectedSketches} />
              {isAdmin() && type === "square" && (
                <button
                  className="footer-button"
                  onClick={() => {
                    setNewPlaylistSketches(selectedSketches);
                    history.push("/playlists");
                  }}
                >
                  <RiPlayList2Fill className="w-6 h-6 mr-2" />
                  Create playlist
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showConsole && (
        <ResizableBox
          axis="x"
          className="flex flex-grow h-full"
          draggableOpts={{ resizeHandles: ["e"] }}
          maxConstraints={[800]}
          minConstraints={[400]}
          resizeHandles={["w"]}
          width={500}
        >
          <Suspense fallback={<Logo className="loading-spinner" />}>
            <Console className="flex-shrink" />
          </Suspense>
        </ResizableBox>
      )}
    </div>
  );
};

export default Flash;
