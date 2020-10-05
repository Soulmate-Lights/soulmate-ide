import { useContainer } from "unstated-next";

import CodeEditor from "~/components/codeEditor";
import Simulator from "~/components/Simulator";
import BuildsContainer from "~/containers/builds";

const Example = ({ code, className }) => {
  const { getBuild } = useContainer(BuildsContainer);
  const config = { rows: 30, cols: 30 };
  const [editorCode, setEditorCode] = useState(code);
  const build = getBuild(editorCode, config);

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
        onSave={(code) => {
          setEditorCode(code);
        }}
      />

      <Simulator
        build={build}
        className="flex flex-col flex-shrink w-5/12 bg-gray-300"
        config={config}
        maxWidth={350}
        showConfig={false}
      />
    </div>
  );
};

export default Example;
