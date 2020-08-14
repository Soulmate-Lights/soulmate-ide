import { HashRouter, Route, Router, Switch } from "react-router-dom";
import classnames from "classnames";

import Dashboard from "./dashboard";
import Editor from "./editor";
import Gallery from "./gallery";
import Flash from "./flash";
import MySketches from "./mySketches";
import Menu from "./menu";
import SelectionsContainer from "~/containers/selection";
import BuildsContainer from "~/containers/builds";
import SketchesContainer from "~/containers/sketches";
import SoulmatesContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";

import Welcome from "./welcome";
import history from "~/utils/history";
import { hot } from "react-hot-loader";
import isElectron from "~/utils/isElectron";

const SpecificRouter = isElectron() ? HashRouter : Router;

const Main = () => {
  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.on("focus", (event, isFocused) => setFocus(isFocused));
    }
  }, []);

  const [focus, setFocus] = useState(true);
  const blur = !focus;

  return (
    <SpecificRouter history={isElectron() ? undefined : history}>
      <div
        className={classnames(
          "h-screen flex overflow-hidden bg-gray-100 dark-mode:bg-gray-300",
          { blur }
        )}
        style={{ WebkitUserSelect: "none" }}
      >
        <div
          className="absolute w-full h-5"
          style={{ WebkitAppRegion: "drag" }}
        />

        <Menu />

        <Switch>
          <Route exact path="/">
            <Dashboard />
          </Route>

          <Route exact path="/tutorial">
            <Welcome />
          </Route>

          <Route exact path="/my-patterns">
            <MySketches />
          </Route>

          <Route exact path="/gallery">
            <Gallery />
          </Route>

          <Route exact path="/flash">
            <Flash />
          </Route>

          <Route
            path="/gallery/:id"
            render={({
              match: {
                params: { id },
              },
            }) => <Editor id={id} />}
          />
          <Route
            path="/my-patterns/:id"
            render={({
              match: {
                params: { id },
              },
            }) => <Editor id={id} mine />}
          />
        </Switch>
      </div>
    </SpecificRouter>
  );
};

const HotMain = hot(module)((params) => <Main {...params} />);

const WrappedHotMain = (params) => (
  <SelectionsContainer.Provider>
    <BuildsContainer.Provider>
      <SketchesContainer.Provider>
        <UserContainer.Provider>
          <SoulmatesContainer.Provider>
            <HotMain {...params} />
          </SoulmatesContainer.Provider>
        </UserContainer.Provider>
      </SketchesContainer.Provider>
    </BuildsContainer.Provider>
  </SelectionsContainer.Provider>
);

export default WrappedHotMain;
