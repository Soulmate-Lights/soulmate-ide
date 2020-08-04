import "./style.css";
import "../simulator/index.css";

import { Mode, useLightSwitch } from "use-light-switch";

import Editor from "~/simulator/Editor";
import { Link } from "react-router-dom";
import Logo from "~/images/logo.svg";
import { MdAccountCircle } from "react-icons/md";
import Simulator from "~/simulator/Simulator";
import UserContainer from "~/containers/userContainer";
import { buildHex } from "~/utils/compiler/compile";
import examples from "./examples";
import { preparePreviewCode } from "~/utils/code";
import screenshotDark from "./dark.png";
import screenshotLight from "./light.png";
import { useContainer } from "unstated-next";

const Welcome = () => {
  const { userDetails, login } = useContainer(UserContainer);
  const [index, setIndex] = useState(0);
  const [builds, setBuilds] = useState({});
  const dark = useLightSwitch() === Mode.Dark;

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
          {index < examples.length ? (
            <a
              disabled={!examples[index - 1]}
              onClick={() => {
                if (index > 0) setIndex(index - 1);
              }}
              className="button"
            >
              Previous example
            </a>
          ) : (
            <a
              onClick={() => {
                setIndex(0);
              }}
              className="button"
            >
              Start over
            </a>
          )}

          {index < examples.length && (
            <a
              disabled={!examples[index]}
              onClick={() => {
                if (index !== examples.length) {
                  setIndex(index + 1);
                }
              }}
              className="button"
            >
              {index === examples.length - 1 ? "Done!" : "Next example"}
            </a>
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
            <p>
              You're ready to get started writing LED patterns. Log in to create
              new patterns, and browse the gallery.
            </p>
            <p>
              <a onClick={login} className="button">
                <MdAccountCircle />
                Log in
              </a>
            </p>
            <img src={dark ? screenshotDark : screenshotLight} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Welcome;
