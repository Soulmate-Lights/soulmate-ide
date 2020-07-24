import "./style.css";

import Editor from "~/simulator/Editor";
import { Link } from "react-router-dom";
import Logo from "~/images/logo.svg";
import Simulator from "~/simulator/Simulator";
import SketchesContainer from "~/containers/sketchesContainer";
import UserContainer from "~/containers/userContainer";
import { buildHex } from "~/utils/compiler/compile";
import history from "~/utils/history";
import { preparePreviewCode } from "~/utils/code";
import { useContainer } from "unstated-next";

const Welcome = () => {
  const { userDetails, login } = useContainer(UserContainer);
  const [build, setBuild] = useState({});

  if (userDetails) {
    history.push("/");
  }

  const config = {
    rows: 20,
    cols: 20,
  };

  const save = async (code) => {
    setBuild(undefined);
    const preparedCode = preparePreviewCode(code, config.rows, config.cols);
    const newBuild = await buildHex(preparedCode);
    setBuild(newBuild);
  };

  return (
    <div className="welcome">
      <div className="welcome-header">
        <div className="left">
          <Logo />
          Soulmate IDE
        </div>

        <div>
          To save your patterns and see the gallery, &nbsp;
          <Link onClick={login} className="button">
            Log in / Sign up
          </Link>
        </div>
      </div>

      <div className="welcome-editor">
        <Editor
          onSave={save}
          build={build}
          sketch={{
            config: config,
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
