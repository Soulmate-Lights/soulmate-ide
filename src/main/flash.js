import "./progress.pcss";

import { AiFillCheckCircle } from "@react-icons/all-files/ai/AiFillCheckCircle";
import { BsLayoutSidebarInsetReverse } from "@react-icons/all-files/bs/BsLayoutSidebarInsetReverse";
import { IoAddCircleSharp } from "@react-icons/all-files/io5/IoAddCircleSharp";
import compact from "lodash/compact";
import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";
import { Suspense } from "react";
import { ResizableBox } from "react-resizable";

import Header from "~/components/Header";
import InstallPython, { needsPython } from "~/components/InstallPython";
import Sketch from "~/components/sketch";
import Soulmates from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import useSWR from "~/hooks/useSwr";
import Logo from "~/images/logo.svg";
import { emptyCode } from "~/utils/code";
import { ALL_SKETCHES_PATH, SKETCHES_PATH } from "~/utils/network";

import FlashButton from "./components/flashButton";

const Console = React.lazy(() => import("./console"));

const Flash = () => {
  const { data: sketches } = useSWR(SKETCHES_PATH);
  const { data: allSketches } = useSWR(ALL_SKETCHES_PATH);

  const { flashing, usbConnected } = Soulmates.useContainer();
  const { userDetails } = UserContainer.useContainer();

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

  const filteredSketches = allSketches
    ?.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    .filter((s) => s.code !== emptyCode);

  let selectedSketches = selected.map(
    (id) =>
      allSketches?.find((s) => s?.id === id) ||
      sketches?.find((s) => s?.id === id)
  );

  // Just in case
  selectedSketches = compact(selectedSketches);

  let users = uniqBy(
    filteredSketches?.map((sketch) => sketch.user),
    (user) => user?.id
  );

  users = users
    ?.map((u) => ({
      ...u,
      sketches: filteredSketches.filter((s) => s.user?.id === u?.id),
    }))
    .filter((u) => u.uid !== userDetails?.sub);

  users = sortBy(users, (u) => -u.sketches?.length);

  const toggle = (sketch) => {
    if (flashing) return;

    if (selected.includes(sketch.id)) {
      setSelected(compact(selected.filter((i) => i !== sketch.id)));
    } else {
      setSelected([...selected, sketch.id]);
    }
  };

  if (needsPython()) return <InstallPython />;

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

        <div className="flex flex-col flex-grow flex-shrink p-4 overflow-auto">
          {sketches?.length > 0 && (
            <div className="pb-2">
              <h3 className="mb-2 text-lg">My Sketches</h3>

              <div className="flex flex-row flex-wrap">
                {sketches?.map((sketch) => (
                  <div
                    className="relative mb-4 mr-4 cursor-pointer"
                    key={sketch.id}
                    onClick={() => toggle(sketch)}
                    style={{
                      cursor: selected.includes(sketch.id)
                        ? "not-allowed"
                        : "copy",
                    }}
                  >
                    <Sketch sketch={sketch} width={96} />

                    {selected.includes(sketch.id) && (
                      <div className="absolute bg-black rounded-full top-2 right-2">
                        <AiFillCheckCircle className=" p-0 text-lg text-white rounded-full shadow " />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {users?.map((user) => (
            <div className="pb-2" key={user.id}>
              <h3 className="mb-2 text-lg">{user.name}</h3>
              <div className="flex flex-row flex-wrap">
                {user.sketches?.map((sketch) => (
                  <div
                    className="relative mb-4 mr-4 cursor-pointer"
                    key={sketch.id}
                    onClick={() => toggle(sketch)}
                    style={{
                      cursor: selected.includes(sketch.id)
                        ? "not-allowed"
                        : "copy",
                    }}
                  >
                    <Sketch sketch={sketch} width={96} />

                    {selected.includes(sketch.id) && (
                      <AiFillCheckCircle className="absolute text-lg text-white border border-black top-2 right-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          <div className="flex flex-row items-center px-4 pt-4 border-t border-gray-300 dark-mode:bg-gray-600 dark-mode:border-gray-700">
            {selectedSketches?.length == 0 && (
              <div className="w-full p-2 pb-6 text-center">
                <IoAddCircleSharp className="inline w-8 h-8 mr-2" />
                Click on the patterns you want to add to your Soulmate from the
                gallery above.
              </div>
            )}
            {selectedSketches?.length > 0 && (
              <div className="bottom-0 flex flex-col flex-wrap flex-shrink pr-4">
                <div className="bottom-0 flex flex-row flex-wrap flex-shrink overflow-auto max-h-48">
                  {selectedSketches.map(
                    (sketch) =>
                      sketch && (
                        <div
                          className="relative mr-4 text-xs cursor-pointer"
                          key={sketch.id}
                          style={{
                            cursor: selected.includes(sketch.id)
                              ? "not-allowed"
                              : "copy",
                          }}
                        >
                          <Sketch
                            className="mb-4"
                            key={sketch.id}
                            onClick={() => toggle(sketch)}
                            sketch={sketch}
                            width={72}
                          />
                          <div className="absolute bg-black rounded-full top-2 right-2">
                            <AiFillCheckCircle className=" p-0 text-lg text-white rounded-full shadow " />
                          </div>
                        </div>
                      )
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 w-full p-4 ml-auto border-t border-gray-300 dark-mode:bg-gray-600 dark-mode:border-gray-700">
            <div className="flex items-center justify-end space-x-4">
              <FlashButton selectedSketches={selectedSketches} />
            </div>
          </div>
        </div>
      </div>
      {showConsole && (
        <ResizableBox
          axis="x"
          className="flex flex-grow flex-shrink-0 h-full"
          draggableOpts={{ resizeHandles: ["e"] }}
          maxConstraints={[800]}
          minConstraints={[300]}
          resizeHandles={["w"]}
          width={300}
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
