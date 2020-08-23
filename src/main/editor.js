import BuildsContainer from "~/containers/builds";
import CodeEditor from "~/components/codeEditor";
import Header from "~/components/Header";
import SelectionsContainer from "~/containers/selection";
import Simulator from "~/components/Simulator";
import SketchesContainer from "~/containers/sketches";
import { emptyCode } from "~/utils/code";
import history from "~/utils/history";

const Editor = ({ id, mine }) => {
  const {
    getSketch,
    save,
    persistCode,
    deleteSketch,
  } = SketchesContainer.useContainer();
  const { getSelection, setSelection } = SelectionsContainer.useContainer();
  const { getBuild } = BuildsContainer.useContainer();

  const config = { rows: 14, cols: 14 };
  const { rows, cols } = config;

  const sketch = getSketch(id);
  if (!sketch) return <>Loading...</>;

  const build = getBuild(sketch.code || emptyCode, rows, cols);

  const selection = getSelection(id);
  const dirty = sketch.dirtyCode !== sketch.code;

  let code = sketch.dirtyCode || sketch.code || emptyCode;

  const confirmAndDelete = () => {
    if (!confirm("Delete this sketch?")) return;
    setTimeout(() => history.push(`/my-patterns`));
    deleteSketch(sketch.id);
  };

  return (
    <div className="flex flex-col flex-grow flex-shrink min-w-0">
      <Header
        title={sketch.name}
        sections={[
          !mine && { title: "Gallery", to: "/gallery" },
          mine && { title: "My patterns", to: "/my-patterns" },
        ]}
        actions={[
          mine && {
            title: "Delete",
            onClick: confirmAndDelete,
            className: "bg-red-500 text-white border-red-800",
          },
          dirty && {
            title: mine ? "Save" : "Refresh",
            onClick: () => save(sketch.id, sketch.dirtyCode),
          },
        ]}
      />

      <div className="flex flex-row flex-grow w-full flex-shrink min-h-0">
        <CodeEditor
          build={build}
          selection={selection}
          className="flex-grow flex-shrink relative min-w-0 bg-white"
          code={code}
          onChangeSelection={(selection) => {
            setSelection(sketch.id, selection);
          }}
          onChange={(code) => {
            persistCode(sketch.id, code);
          }}
          onSave={(code) => {
            // TODO: Combine these two into save-and-build in the sketches container?
            save(sketch.id, code);
          }}
        />

        <Simulator
          build={build}
          rows={14}
          cols={14}
          className="flex flex-col"
        />
      </div>
    </div>
  );
};

export default Editor;
