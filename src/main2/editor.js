import CodeEditor from "./codeEditor";
import Header from "./components/Header";
import SelectionsContainer from "~/containers/selectionContainer";
import Simulator from "./components/Simulator";
import SketchesContainer from "~/containers/sketchesContainer";
import { emptyCode } from "~/utils/code";
import { useContainer } from "unstated-next";

const Editor = ({ id }) => {
  const { getSketch, buildSketch, getBuild } = useContainer(SketchesContainer);
  const { getSelection, setSelection } = useContainer(SelectionsContainer);
  const { save, persistCode } = useContainer(SketchesContainer);

  const sketch = getSketch(id);
  if (!sketch) return <>Loading...</>;
  const selection = getSelection(id);
  const build = getBuild(sketch, sketch.config);

  let code = sketch.dirtyCode || sketch.code || emptyCode;

  if (!build) {
    buildSketch(sketch.id, code, sketch.config);
  }

  return (
    <div className="flex flex-col flex-grow flex-shrink min-w-0">
      <Header
        title="Sketch Name"
        sections={[
          { title: "Gallery", to: "/gallery" },
          { title: "My patterns", to: "/my-patterns" },
        ]}
        actions={[
          sketch.dirtyCode && {
            title: "Save",
            onClick: () => save(sketch.id, sketch.dirtyCode),
          },
        ]}
      />

      <div className="flex flex-row flex-grow w-full flex-shrink min-h-0">
        <CodeEditor
          selection={selection}
          onChangeSelection={(selection) => setSelection(sketch.id, selection)}
          className="flex-grow flex-shrink relative min-w-0 bg-white"
          code={code}
          onChange={(code) => {
            persistCode(sketch.id, code);
          }}
          onSave={(code) => {
            // TODO: Combine these two?
            save(sketch.id, code);
            buildSketch(sketch.id, code, sketch.config);
          }}
        />

        <Simulator
          build={build}
          rows={70}
          cols={15}
          className="flex flex-col"
          style={{ width: 300 }}
        />
      </div>
    </div>
  );
};

export default Editor;
