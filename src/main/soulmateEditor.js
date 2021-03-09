import uniqBy from "lodash/uniqBy";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import { useList, useStateList } from "react-use";

import CodeEditor from "~/components/codeEditor";
import Header from "~/components/Header";
import Simulator from "~/components/Simulator";
import Sketch from "~/components/sketch";
import SoulmatesContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import useBuild from "~/hooks/useBuild";
import useSWR from "~/hooks/useSwr";
import Logo from "~/images/logo.svg";
import { emptyCode } from "~/utils/code";
import { ALL_SKETCHES_PATH, SKETCHES_PATH } from "~/utils/network";

import soulmateName from "./utils/soulmateName";

const SortableTab = SortableElement(
  ({ sketch, sketchIndex, selected, removeSketch }) => {
    return (
      <div
        className={classnames(
          "px-4 py-2 ml-1 rounded-tl rounded-tr cursor-pointer whitespace-nowrap text-sm",
          { "bg-white": selected, "text-white": !selected }
        )}
        // key={sketchIndex}
      >
        {sketch.name}
        {selected && (
          <button
            className="ml-4 text-xs"
            onClick={() => {
              console.log(`Removing ${sketch.name}`, sketchIndex);
              removeSketch(sketchIndex);
            }}
          >
            ❌
          </button>
        )}
      </div>
    );
  }
);

const SortableList = SortableContainer(
  ({ items, selectedSketchIndex, removeSketch, selectSketch }) => (
    <div className="flex flex-row pt-4 overflow-auto">
      {items.map((value, index) => (
        <SortableTab
          index={index}
          key={`item-${value.name}`}
          removeSketch={removeSketch}
          selectSketch={selectSketch}
          selected={index === selectedSketchIndex}
          sketch={value}
          sketchIndex={index}
          value={value}
        />
      ))}
    </div>
  )
);

const SoulmateEditor = () => {
  const {
    selectedSoulmate,
    flashSketches,
    flashing,
    usbFlashingPercentage,
  } = SoulmatesContainer.useContainer();
  const { userDetails } = UserContainer.useContainer();
  const { config = {} } = selectedSoulmate || {};
  const [adding, setAdding] = useState(false);

  const buildId = selectedSoulmate?.config?.build;
  const fetcher = (url) => fetch(url).then((d) => d.json());
  const path = buildId ? `builds/${buildId}` : null;
  const { data } = useSWR(path, fetcher);

  const [
    sketches,
    {
      set: setSketches,
      update: updateSketch,
      push: addSketch,
      remove: removeSketch,
      removeAt: removeSketchAt,
      insertAt: insertSketchAt,
    },
  ] = useList(data?.sketches);

  const {
    state: sketch,
    setState: setSelectedSketch,
    setStateAt: setSelectedSketchIndex,
    currentIndex: selectedSketchIndex,
  } = useStateList(sketches);

  useEffect(() => {
    setSketches(data?.sketches || []);
  }, [data?.sketches, selectedSoulmate]);

  useEffect(() => {
    if (sketches[0] && selectedSketchIndex === undefined) {
      setSelectedSketch(sketches[0]);
    }
  });

  const code = sketch?.code || "";
  const build = useBuild(code, config);
  const sketchComparer = (a, b) => a.id === b.id;
  const { data: mySketches } = useSWR(SKETCHES_PATH);
  const { data: allSketches } = useSWR(ALL_SKETCHES_PATH);
  let users = uniqBy(
    allSketches?.map((sketch) => sketch.user),
    (user) => user?.id
  );
  users = users
    ?.map((u) => ({
      ...u,
      sketches: allSketches.filter((s) => s.user?.id === u?.id),
    }))
    .filter((u) => u.uid !== userDetails?.sub);

  const dirty = JSON.stringify(sketches) !== JSON.stringify(data?.sketches);

  return (
    <div className="flex flex-col flex-grow flex-shrink h-full min-w-0">
      <Header
        actions={[
          dirty && {
            title: "Revert",
            onClick: () => setSketches(data.sketches),
            className: "bg-red-200 border-red-300",
          },
          {
            title: flashing ? (
              <>
                <Logo className="w-6 h-6 mr-4 spinner" />
                <progress
                  className="my-2 border border-purple-400 usb-flash"
                  max="100"
                  value={usbFlashingPercentage}
                >
                  {usbFlashingPercentage}%{" "}
                </progress>
              </>
            ) : (
              <>Save changes</>
            ),
            onClick: () => flashSketches(sketches, config),
          },
        ]}
        title={soulmateName(selectedSoulmate)}
      />
      <div className="flex flex-row flex-shrink-0 w-full pl-4 overflow-auto text-gray-800 bg-gray-700">
        <SortableList
          axis="x"
          items={sketches}
          lockAxis="x"
          onSortEnd={(details) => {
            setAdding(false);
            const { newIndex, oldIndex } = details;
            if (newIndex !== oldIndex) {
              const movedSketch = sketches[oldIndex];
              removeSketchAt(oldIndex);
              insertSketchAt(newIndex, movedSketch);
            }
            setSelectedSketchIndex(newIndex);
          }}
          removeSketch={(sketch) => {
            removeSketch(sketch);
          }}
          selectSketch={(sketch) => {
            setSelectedSketch(sketch);
          }}
          selectedSketchIndex={selectedSketchIndex}
        />

        <div className="flex flex-col justify-center ml-auto mr-4">
          <div
            className="text-white button-small whitespace-nowrap"
            onClick={() => {
              setSelectedSketchIndex(undefined);
              setAdding(true);
            }}
          >
            Add from gallery
          </div>
        </div>
      </div>

      {!adding && selectedSketchIndex > -1 && sketch && (
        <div className="flex flex-row flex-grow flex-shrink h-full">
          <div className="flex flex-row flex-grow flex-shrink min-w-0 min-h-0">
            <CodeEditor
              build={build}
              className="relative flex-grow flex-shrink w-6/12 min-w-0 min-h-0 bg-white"
              code={sketch?.code || emptyCode}
              key={selectedSketchIndex + sketches.length}
              onHesitation={(code) => {
                const updatedSketch = { ...sketch, code };
                updateSketch(sketchComparer, updatedSketch);
              }}
              onSave={(code) => {
                const updatedSketch = { ...sketch, code };
                updateSketch(sketchComparer, updatedSketch);
              }}
            />

            <Simulator
              build={build}
              className="flex flex-col flex-grow"
              config={config}
              hideResolutionMenu
              minWidth={400}
            />
          </div>
        </div>
      )}

      {adding && (
        <div className="flex flex-col flex-grow flex-shrink p-4 overflow-auto">
          {mySketches?.length > 0 && (
            <div className="pb-2">
              <h3 className="mb-2 text-lg">My Sketches</h3>

              <div className="flex flex-row flex-wrap">
                {mySketches?.map((sketch) => (
                  <div
                    className="relative mb-4 mr-4 cursor-pointer"
                    key={sketch.id}
                    onClick={() => addSketch(sketch)}
                    // style={{
                    //   cursor: selected.includes(sketch.id)
                    //     ? "not-allowed"
                    //     : "copy",
                    // }}
                  >
                    <Sketch sketch={sketch} width={96} />

                    {/* {selected.includes(sketch.id) && (
                      <div className="absolute bg-black rounded-full top-2 right-2">
                        <AiFillCheckCircle className=" p-0 text-lg text-white rounded-full shadow " />
                      </div>
                    )} */}
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
                    onClick={() => addSketch(sketch)}
                    style={
                      {
                        // cursor: selected.includes(sketch.id)
                        //   ? "not-allowed"
                        //   : "copy",
                      }
                    }
                  >
                    <Sketch sketch={sketch} width={96} />

                    {/* {selected.includes(sketch.id) && (
                      <AiFillCheckCircle className="absolute text-lg text-white border border-black top-2 right-2" />
                    )} */}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SoulmateEditorWrapper = () => {
  const { selectedSoulmate } = SoulmatesContainer.useContainer();
  if (!selectedSoulmate?.config) return <Logo className="loading-spinner" />;
  return <SoulmateEditor />;
};

export default SoulmateEditorWrapper;
