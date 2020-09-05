import { useContainer } from "unstated-next";
import { Mode, useLightSwitch } from "use-light-switch";

import CodeEditor from "~/components/codeEditor";
import Header from "~/components/Header";
import Simulator from "~/components/Simulator";
import BuildsContainer from "~/containers/builds";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";

import screenshotDark from "./dark.png";
import examples from "./examples";
import screenshotLight from "./light.png";

const Finished = () => {
  const { login } = useContainer(UserContainer);
  const dark = useLightSwitch() === Mode.Dark;
  return (
    <div className="items-center justify-center flex flex-col flex-grow width-full px-20 py-10 space-y-8">
      <Logo />
      <span className="items-center flex flex-col">
        <span className="font-thin text-5xl">All set!</span>
        <p>You're ready to get started writing LED patterns!</p>
      </span>
      <p className=" space-x-4">
        <button
          onClick={login}
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
        >
          Log in
        </button>

        <a
          href="/gallery"
          type="button"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
        >
          Gallery
        </a>
      </p>
      <img
        style={{ maxWidth: "80%", maxHeight: "50%" }}
        src={dark ? screenshotDark : screenshotLight}
      />
    </div>
  );
};

const Welcome = () => {
  const [savedCodes, setSavedCodes] = useState({});
  const { getBuild } = useContainer(BuildsContainer);
  const [index, setIndex] = useState(0);
  const rows = 30;
  const cols = 30;
  const code = savedCodes[index] || examples[index];
  const build = getBuild(code, rows, cols);

  const actions = [];
  if (index > 0) {
    actions.push({
      disabled: !examples[index - 1],
      onClick: () => index > 0 && setIndex(index - 1),
      title: "Previous example",
    });
  }
  if (index < examples.length - 1) {
    actions.push({
      title: "Next example",
      onClick: () => setIndex(index + 1),
    });
  } else if (index === examples.length - 1) {
    actions.push({
      title: "Done!",
      onClick: () => setIndex(index + 1),
    });
  } else {
    actions.push({
      onClick: () => setIndex(0),
      title: "Start over",
    });
  }

  return (
    <div className="flex flex-col flex-grow flex-shrink min-w-0">
      <Header title="Tutorial" actions={actions} />
      <div className="flex flex-row flex-grow flex-shrink flex-shrink min-w-0 min-h-0 ">
        {!examples[index] ? (
          <Finished />
        ) : (
          <>
            {code && (
              <CodeEditor
                className="flex-grow flex-shrink relative min-w-0 bg-white w-7/12"
                key={index}
                code={code}
                onSave={(code) =>
                  setSavedCodes({ ...savedCodes, [index]: code })
                }
              />
            )}

            <Simulator
              className="flex flex-col flex-shrink w-5/12"
              build={build}
              config={{ rows, cols }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Welcome;
