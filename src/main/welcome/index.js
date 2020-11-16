import { Helmet } from "react-helmet";
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
    <div className="flex flex-col items-center justify-center flex-grow px-20 py-10 width-full space-y-8">
      <Logo />
      <span className="flex flex-col items-center">
        <span className="text-5xl font-thin">All set!</span>
        <p>You&apos;re ready to get started writing LED patterns!</p>
      </span>
      <p className=" space-x-4">
        <button
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-purple-600 border border-transparent leading-6 rounded-md hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-purple active:bg-purple-700 transition ease-in-out duration-150"
          onClick={login}
          type="button"
        >
          Log in
        </button>

        <a
          className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-purple-600 border border-transparent leading-6 rounded-md hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-purple active:bg-purple-700 transition ease-in-out duration-150"
          href="/gallery"
          type="button"
        >
          Gallery
        </a>
      </p>
      <img
        src={dark ? screenshotDark : screenshotLight}
        style={{ maxWidth: "80%", maxHeight: "50%" }}
      />
    </div>
  );
};

const Welcome = () => {
  const [savedCodes, setSavedCodes] = useState({});
  const { getBuild } = useContainer(BuildsContainer);
  const [index, setIndex] = useState(0);
  const config = { rows: 30, cols: 30 };
  const code = savedCodes[index] || examples[index];
  const build = getBuild(code, config);

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

  const save = (code) => {
    setSavedCodes({ ...savedCodes, [index]: code });
  };

  return (
    <div className="flex flex-col flex-grow flex-shrink min-w-0">
      <Helmet>
        <title>Tutorial &mdash; Soulmate IDE</title>
      </Helmet>
      <Header actions={actions} title="Tutorial" />
      <div className="flex flex-row flex-grow flex-shrink min-w-0 min-h-0">
        {!examples[index] ? (
          <Finished />
        ) : (
          <>
            <CodeEditor
              className="relative flex-grow flex-shrink w-7/12 min-w-0 bg-white"
              code={code}
              key={index}
              onSave={save}
            />

            <Simulator
              build={build}
              className="flex flex-col flex-shrink w-5/12"
              config={config}
              maxWidth={350}
            />
          </>
        )}
      </div>
    </div>
  );
};

const WrappedWelcome = (...props) => (
  <BuildsContainer.Provider>
    <UserContainer.Provider>
      <Welcome {...props} />
    </UserContainer.Provider>
  </BuildsContainer.Provider>
);

export default WrappedWelcome;
