import "react-resizable/css/styles.css";

import classnames from "classnames";
import { hot } from "react-hot-loader";
import { HashRouter, Route, Router, Switch } from "react-router-dom";
import { LastLocationProvider } from "react-router-last-location";

import Notifications from "~/components/notifications";
import BuildsContainer from "~/containers/builds";
import ConfigContainer from "~/containers/config";
import NotificationsContainer from "~/containers/notifications";
import SelectionsContainer from "~/containers/selection";
import SketchesContainer from "~/containers/sketches";
import SoulmateContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import history from "~/utils/history";
import isElectron from "~/utils/isElectron";

import Config from "./config";
import Dashboard from "./dashboard";
import Editor from "./editor";
import Flash from "./flash";
import Gallery from "./gallery";
import Menu from "./menu";
import MySketches from "./mySketches";
import User from "./user";
import Welcome from "./welcome";

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
      <LastLocationProvider>
        <div
          className={classnames(
            "h-screen flex overflow-hidden bg-gray-100 dark-mode:bg-gray-300 font-medium"
          )}
          style={{ WebkitUserSelect: "none", opacity: blur ? "0.9" : 1 }}
        >
          <div
            className="absolute w-full h-5"
            style={{ WebkitAppRegion: "drag" }}
          />

          <Menu />

          <Notifications />

          <div className="flex flex-row flex-grow flex-shrink w-full min-w-0 bg-gray-100 dark-mode:bg-gray-800 dark-mode:text-white">
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
                path="/gallery/user/:id"
                render={({
                  match: {
                    params: { id },
                  },
                }) => <User id={id} />}
              />

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
        </div>
      </LastLocationProvider>
    </SpecificRouter>
  );
};

const HotMain = hot(module)((params) => <Main {...params} />);

const WrappedHotMain = (params) => (
  <NotificationsContainer.Provider>
    <ConfigContainer.Provider>
      <SelectionsContainer.Provider>
        <BuildsContainer.Provider>
          <SketchesContainer.Provider>
            <UserContainer.Provider>
              <SoulmateContainer.Provider>
                <HotMain {...params} />
              </SoulmateContainer.Provider>
            </UserContainer.Provider>
          </SketchesContainer.Provider>
        </BuildsContainer.Provider>
      </SelectionsContainer.Provider>
    </ConfigContainer.Provider>
  </NotificationsContainer.Provider>
);

export default WrappedHotMain;
