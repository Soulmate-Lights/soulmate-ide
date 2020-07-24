import "./style.css";

import Editor from "~/simulator/Editor";
import Logo from "~/images/logo.svg";
import Simulator from "~/simulator/Simulator";
import UserContainer from "~/containers/userContainer";
import { buildHex } from "~/utils/compiler/compile";
import examples from "./examples";
import history from "~/utils/history";
import { preparePreviewCode } from "~/utils/code";
import { useContainer } from "unstated-next";

const Welcome = () => {
  const [index, setIndex] = useState(0);
  const { userDetails } = useContainer(UserContainer);
  const [build, setBuild] = useState({});
  const sampleCode = examples[index];

  if (userDetails) {
    history.push("/");
  }

  const config = {
    rows: 30,
    cols: 30,
  };

  const save = async (code) => {
    setBuild(undefined);
    const preparedCode = preparePreviewCode(code, config.rows, config.cols);
    const newBuild = await buildHex(preparedCode);
    setBuild(newBuild);
  };

  useEffect(() => {
    save(sampleCode);
  }, []);

  useEffect(() => {
    setBuild(undefined);
    save(sampleCode);
  }, [index]);

  return (
    <div className="welcome">
      <div className="welcome-header">
        <div className="left">
          <Logo className="logo" />
          Soulmate IDE
        </div>

        <div className="welcome-navigation">
          {examples[index - 1] && (
            <a onClick={() => setIndex(index - 1)} className="button">
              Previous example
            </a>
          )}
          <a
            disabled={!examples[index + 1]}
            onClick={() => {
              examples[index + 1] && setIndex(index + 1);
            }}
            className="button"
          >
            Next example
          </a>
        </div>
      </div>

      <div className="welcome-editor">
        <Editor
          key={index}
          onSave={save}
          build={build}
          sketch={{
            config: config,
            code: sampleCode,
          }}
        />
        <Simulator
          rows={config.rows}
          cols={config.cols}
          build={build}
          width={config.cols * 10}
          height={config.rows * 10}
        />
      </div>
    </div>
  );
};

export default Welcome;
