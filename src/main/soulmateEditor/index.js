import { HiOutlineArrowCircleRight } from "@react-icons/all-files/hi/HiOutlineArrowCircleRight";
import { useList, useStateList } from "react-use";

import CodeEditor from "~/components/codeEditor";
import Header from "~/components/Header";
import Simulator from "~/components/Simulator";
import Sketch from "~/components/sketch";
import SoulmatesContainer from "~/containers/soulmates";
import useBuild from "~/hooks/useBuild";
import useSavedFirmware from "~/hooks/useSavedFirmware";
import useSWR from "~/hooks/useSwr";
import Logo from "~/images/logo.svg";
import { emptyCode } from "~/utils/code";
import groupSketchesToUsers from "~/utils/groupSketchesToUsers";
import history from "~/utils/history";
import { ALL_SKETCHES_PATH } from "~/utils/network";
import soulmateName from "~/utils/soulmateName";

import { SketchTabs } from "./tabs";

const SoulmateEditor = () => {
  const { selectedSoulmate, flashSketches, flashing, usbFlashingPercentage } =
    SoulmatesContainer.useContainer();
  const { config = {} } = selectedSoulmate || {};
  const savedFirmware = useSavedFirmware(selectedSoulmate);

  const [
    sketches,
    {
      set: setSketches,
      update: updateSketch,
      push: pushSketch,
      remove: removeSketch,
      removeAt: removeSketchAt,
      insertAt: insertSketchAt,
    },
  ] = useList(savedFirmware?.sketches);

  const [adding, setAdding] = useState(sketches.length === 0);

  // Hack for uniqueness
  const addSketch = (sketch) => {
    if (!sketches.includes(sketch)) pushSketch(sketch);
  };

  const {
    state: sketch,
    setState: setSelectedSketch,
    setStateAt: setSelectedSketchIndex,
    currentIndex: selectedSketchIndex,
  } = useStateList(sketches);

  useEffect(() => {
    setSketches(savedFirmware?.sketches || []);
  }, [savedFirmware?.sketches, selectedSoulmate]);

  useEffect(() => {
    if (!adding && sketches[0] && selectedSketchIndex === undefined) {
      setSelectedSketch(sketches[0]);
    }
  }, [sketches, adding, selectedSketchIndex]);

  useEffect(() => {
    if (adding) {
      setSelectedSketchIndex(undefined);
    } else if (!adding && selectedSketchIndex === -1) {
      setSelectedSketchIndex(0);
    }
  }, [adding, selectedSketchIndex, setSelectedSketchIndex]);

  const code = sketch?.code || "";
  const build = useBuild(code, config);
  const sketchComparer = (a, b) => a.id === b.id;
  const { data: allSketches } = useSWR(ALL_SKETCHES_PATH);
  let users = groupSketchesToUsers(allSketches);

  const dirty =
    JSON.stringify(sketches) !== JSON.stringify(savedFirmware?.sketches);

  return (
    <div className="flex flex-col flex-grow flex-shrink h-full min-w-0">
      <Header
        actions={[
          dirty && {
            title: "Revert",
            onClick: () => setSketches(savedFirmware.sketches),
            className: "bg-red-200 border-red-300",
          },
          {
            className: "bg-purple-200 text-white",
            linkClass: "text-bold text-white",
            title: flashing ? (
              <>
                <Logo className="w-4 h-4 mr-4 spinner" />
                <progress
                  className="border border-purple-400 my-1.5 usb-flash"
                  max="100"
                  value={usbFlashingPercentage}
                >
                  {usbFlashingPercentage}%{" "}
                </progress>
              </>
            ) : (
              <span className="flex flex-row text-md">
                <HiOutlineArrowCircleRight className="mr-2 text-xl" />
                Save patterns
              </span>
            ),
            onClick: () => flashSketches(sketches, config),
          },
        ]}
        title={soulmateName(selectedSoulmate)}
      />
      <div className="flex flex-row flex-shrink-0 w-full pl-4 overflow-auto bg-gray-200 dark-mode:text-gray-800 dark-mode:bg-gray-700">
        <SketchTabs
          adding={adding}
          axis="x"
          distance={1}
          items={sketches}
          lockAxis="x"
          lockToContainerEdges
          onSortEnd={({ newIndex, oldIndex }) => {
            setAdding(false);
            const movedSketch = sketches[oldIndex];
            removeSketchAt(oldIndex);
            insertSketchAt(newIndex, movedSketch);
            setSelectedSketchIndex(newIndex);
          }}
          removeSketch={(sketch) => removeSketch(sketch)}
          selectSketch={(sketch) => {
            setAdding(false);
            setSelectedSketch(sketch);
          }}
          selectedSketchIndex={selectedSketchIndex}
          setAdding={(isAdding) => {
            setAdding(isAdding);
            if (isAdding) setSelectedSketchIndex(undefined);
          }}
        />
      </div>

      {!adding && selectedSketchIndex > -1 && sketch && (
        <div className="flex flex-row flex-grow flex-shrink h-full">
          <div className="flex flex-row flex-grow flex-shrink min-w-0 min-h-0">
            <CodeEditor
              build={build}
              className="relative flex-grow flex-shrink w-6/12 min-w-0 min-h-0 bg-white"
              code={sketch?.code || emptyCode}
              key={selectedSketchIndex + sketches.length}
              onHesitation={(code) =>
                updateSketch(sketchComparer, { ...sketch, code })
              }
              onSave={(code) =>
                updateSketch(sketchComparer, { ...sketch, code })
              }
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
        <div className="flex flex-col flex-grow flex-shrink p-4 p-8 pr-0 overflow-auto">
          {users?.map((user) => (
            <div className="pb-2" key={user.id}>
              <h3 className="mb-2 text-lg">
                <img
                  alt="avatar"
                  className="flex-shrink-0 inline-block object-cover w-8 h-8 mr-2 rounded-full"
                  referrerPolicy="no-referrer"
                  src={user?.image}
                />
                {user.name}
              </h3>
              <div className="flex flex-row flex-wrap">
                {user.sketches?.map((sketch) => (
                  <div
                    className="relative mb-4 mr-4"
                    key={sketch.id}
                    onClick={() => addSketch(sketch)}
                    style={{ cursor: "copy" }}
                  >
                    <Sketch sketch={sketch} width={96} />
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
  if (!selectedSoulmate) history.push("/gallery");
  if (!selectedSoulmate?.config) return <Logo className="loading-spinner" />;
  return <SoulmateEditor />;
};

export default SoulmateEditorWrapper;
