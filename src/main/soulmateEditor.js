import { useStateList } from "react-use";

import CodeEditor from "~/components/codeEditor";
import Header from "~/components/Header";
import Simulator from "~/components/Simulator";
import SoulmatesContainer from "~/containers/soulmates";
import useBuild from "~/hooks/useBuild";
import useSWR from "~/hooks/useSwr";
import Logo from "~/images/logo.svg";
import { emptyCode } from "~/utils/code";

import soulmateName from "./utils/soulmateName";

const SoulmateEditor = () => {
  const { selectedSoulmate } = SoulmatesContainer.useContainer();

  const buildId = selectedSoulmate?.config?.build;

  const { data } = useSWR(buildId ? `builds/${buildId}` : null, (url) =>
    fetch(url).then((d) => d.json())
  );

  const [sketches, setSketches] = useState([]);

  useEffect(() => {
    setSketches(data?.sketches || []);
  }, [data?.sketches, selectedSoulmate]);

  const {
    state: sketch,
    setState: setSelectedSketch,
    currentIndex: selectedSketchIndex,
  } = useStateList(data?.sketches);

  const code = sketch?.code;
  const { config = {} } = selectedSoulmate || {};
  const build = useBuild(code, config);

  if (!selectedSoulmate) return null;

  return (
    <div className="flex flex-col flex-grow flex-shrink h-full min-w-0">
      <Header
        actions={[{ title: "Save changes" }]}
        title={<>{soulmateName(selectedSoulmate)}</>}
      />
      <div className="flex flex-row flex-shrink-0 w-full pl-4 overflow-auto text-gray-800 bg-gray-700 border-r border-gray-200 w-72 dark-mode:border-gray-700">
        <div className="flex flex-row pt-4">
          {sketches.map((s, index) => (
            <a
              className={classnames(
                "px-4 py-2 ml-1 rounded-tl rounded-tr cursor-pointer",
                {
                  "bg-white": index === selectedSketchIndex,
                  "text-white": index !== selectedSketchIndex,
                }
              )}
              key={s.name}
              onClick={() => setSelectedSketch(s)}
            >
              {s.name}
            </a>
          ))}
        </div>

        <div className="flex flex-col justify-center ml-auto mr-8">
          <div className=" text-white button-small">Add from gallery</div>
        </div>
      </div>
      <div className="flex flex-row flex-grow flex-shrink h-full">
        <div className="flex flex-row flex-grow flex-shrink min-w-0 min-h-0">
          {sketch && (
            <>
              <CodeEditor
                build={build}
                className="relative flex-grow flex-shrink w-6/12 min-w-0 min-h-0 bg-white"
                code={sketch?.code || emptyCode}
                key={selectedSketchIndex}
                onChange={(_code) => {
                  // sketches[index].code = code;
                  // setSketches(sketches);
                  // setDirty(true);
                }}
                onSave={(_code) => {
                  // setDirty(false);
                  // sketches[index].code = code;
                  // setSketches(sketches);
                  // savePlaylist(playlist.id, { sketches });
                }}
              />

              <Simulator
                build={build}
                className="flex flex-col flex-grow"
                config={config}
                hideResolutionMenu
                minWidth={400}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const SoulmateEditorWrapper = () => {
  const { selectedSoulmate } = SoulmatesContainer.useContainer();
  if (!selectedSoulmate?.config) return <Logo className="loading-spinner" />;
  return <SoulmateEditor />;
};

export default SoulmateEditorWrapper;
