import "./style.css";

import { Link } from "react-router-dom";
import Editor from "~/simulator/Editor";
import Logo from "~/images/logo.svg";
import Simulator from "~/simulator/Simulator";
import UserContainer from "~/containers/userContainer";
import { buildHex } from "~/utils/compiler/compile";
import examples from "./examples";
import { MdAccountCircle } from "react-icons/md";
import { preparePreviewCode } from "~/utils/code";
import { useContainer } from "unstated-next";

const Welcome = () => {
  const { userDetails, login } = useContainer(UserContainer);
  const [index, setIndex] = useState(0);
  const [builds, setBuilds] = useState({});

  const saveBuild = (id, build) => {
    setBuilds({
      ...builds,
      [id]: build,
    });
  };

  const build = builds[index];
  const sampleCode = examples[index];

  const config = {
    rows: 30,
    cols: 30,
  };

  const save = async (index, code) => {
    saveBuild(index, undefined);
    const preparedCode = preparePreviewCode(code, config.rows, config.cols);
    const newBuild = await buildHex(preparedCode);
    saveBuild(index, newBuild);
  };

  useEffect(() => {
    save(index, sampleCode);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      save(index, examples[index]);
    }, 1);
  }, [index]);

  return (
    <div className="welcome">
      <div className="welcome-header">
        <div className="left">
          <Logo className="logo" />
          Soulmate IDE
        </div>

        <div className="welcome-navigation">
          <a
            disabled={!examples[index - 1]}
            onClick={() => setIndex(index - 1)}
            className="button"
          >
            Previous example
          </a>
          <a
            disabled={!examples[index]}
            onClick={() => {
              setIndex(index + 1);
            }}
            className="button"
          >
            Next example
          </a>

          {!examples[index + 1] && userDetails && (
            <Link to="/" className="button">
              Close the tutorial
            </Link>
          )}
        </div>
      </div>

      <div className="welcome-editor">
        {examples[index] && (
          <>
            <Editor
              key={index}
              onSave={(code) => {
                save(index, code);
              }}
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
          </>
        )}

        {!examples[index] && (
          <div className="welcome-finished">
            <Logo />
            <h1>That's it!</h1>
            <p>You're now ready to get started writing LED patterns.</p>
            <p>Log in to get started:</p>
            <a onClick={login} className="button">
              <MdAccountCircle />
              Log in
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
