import CodeEditor from "~/components/codeEditor";
import Simulator from "~/components/Simulator";
import useBuild from "~/hooks/useBuild";

const config = { rows: 24, cols: 24 };

const Example = ({ code, className }) => {
  const [editorCode, setEditorCode] = useState(code);
  const build = useBuild(editorCode, config);

  return (
    <div
      className={classnames(className, [
        "flex",
        "items-center, mx-auto overflow-hidden",
        "border-gray-200 border rounded-lg",
      ])}
      style={{ minHeight: 480 }}
    >
      <CodeEditor
        autoFocus={false}
        autoFormat={false}
        className="relative flex-grow flex-shrink w-7/12 min-w-0 bg-white"
        code={code}
        onHesitation={setEditorCode}
        onSave={setEditorCode}
      />

      <Simulator
        build={build}
        classpame="flex flex-col flex-shrink w-5/12 bg-gray-300 dark-mode:bg-gray-800"
        config={config}
        hideResolutionMenu
        minWidth={400}
      />
    </div>
  );
};

export default Example;
