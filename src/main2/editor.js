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

  const config = { rows: 14, cols: 14 };

  const sketch = getSketch(id);
  if (!sketch) return <>Loading...</>;
  const selection = getSelection(id);
  const build = getBuild(sketch, config);
  let code = sketch.dirtyCode || sketch.code || emptyCode;
  if (!build) buildSketch(sketch.id, code, config);
  const dirty = sketch.dirtyCode !== sketch.code;

  return (
    <div className="flex flex-col flex-grow flex-shrink min-w-0">
      <Header
        title={sketch.name}
        sections={[
          { title: "Gallery", to: "/gallery" },
          { title: "My patterns", to: "/my-patterns" },
        ]}
        actions={[
          dirty && {
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
            // TODO: Combine these two into save-and-build in the sketches container?
            save(sketch.id, code);
            buildSketch(sketch.id, code, sketch.config);
          }}
        />

        <Simulator
          build={build}
          rows={14}
          cols={14}
          className="flex flex-col"
          style={{ maxWidth: 300 }}
        />
      </div>
    </div>
  );
};

export default Editor;
