import { HashRouter, Route, Router, Switch } from "react-router-dom";

import BuildsContainer from "~/containers/builds";
import Config from "./config";
import ConfigContainer from "~/containers/config";
import Dashboard from "./dashboard";
import Editor from "./editor";
import Flash from "./flash";
import Gallery from "./gallery";
import Menu from "./menu";
import MySketches from "./mySketches";
import SelectionsContainer from "~/containers/selection";
import SketchesContainer from "~/containers/sketches";
import SoulmatesContainer from "~/containers/soulmates";
import User from "./user";
import UserContainer from "~/containers/user";
import Welcome from "./welcome";
import classnames from "classnames";
import history from "~/utils/history";
import { hot } from "react-hot-loader";
import isElectron from "~/utils/isElectron";

const SpecificRouter = isElectron() ? HashRouter : Router;

const Main = () => {
  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.on("focus", (event, isFocused) => setFocus(isFocused));
    }
  }, [window, window.ipcRenderer]);

  const [focus, setFocus] = useState(true);
  const blur = !focus;

  return (
    <SpecificRouter history={isElectron() ? undefined : history}>
      <div
        className={classnames(
          "h-screen flex overflow-hidden bg-gray-100 dark-mode:bg-gray-300"
        )}
        style={{ WebkitUserSelect: "none", opacity: blur ? "0.9" : 1 }}
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

          <Route exact path="/config">
            <Config />
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
            path="/user/:id"
            render={({
              match: {
                params: { id },
              },
            }) => <User id={id} />}
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

const WrappedHotMain = hot(module)((params) => (
  <ConfigContainer.Provider>
    <SelectionsContainer.Provider>
      <BuildsContainer.Provider>
        <SketchesContainer.Provider>
          <UserContainer.Provider>
            <SoulmatesContainer.Provider>
              <Main {...params} />
            </SoulmatesContainer.Provider>
          </UserContainer.Provider>
        </SketchesContainer.Provider>
      </BuildsContainer.Provider>
    </SelectionsContainer.Provider>
  </ConfigContainer.Provider>
));

export default WrappedHotMain;
