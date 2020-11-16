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
import isMac from "~/utils/isMac";

import Marketing from "../marketing";
import Config from "./config";
import Console from "./console";
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
    window.ipcRenderer?.on("focus", (event, isFocused) => setFocus(isFocused));
  }, [window, window.ipcRenderer]);

  const [focus, setFocus] = useState(true);
  const blur = !focus;
  const marketing =
    document.location.href === "https://www.soulmatelights.com/";

  const showTopBar = isMac() && isElectron();

  return (
    <div className="relative flex flex-col flex-grow h-screen dark-mode:bg-gray-300 dark-mode:bg-gray-700">
      {showTopBar && (
        <div
          className={classnames("absolute w-full h-6  border-b ", {
            "bg-gray-200 dark-mode:bg-gray-700 border-gray-300 dark-mode:border-gray-600": focus,
            "bg-gray-100 dark-mode:bg-gray-600 dark-mode:border-gray-700 ": !focus,
          })}
          style={{ WebkitAppRegion: "drag" }}
        />
      )}

      <div
        className={classnames("flex flex-grow flex-col flex-shrink h-screen", {
          "pt-6": showTopBar,
        })}
      >
        <ContainerProvider>
          <SpecificRouter history={isElectron() ? undefined : history}>
            <LastLocationProvider>
              <Switch>
                {marketing && (
                  <Route exact path="/">
                    <Marketing />
                  </Route>
                )}

                <Route exact path="/marketing">
                  <Marketing />
                </Route>

                <Route>
                  <div
                    className={classnames(
                      "flex flex-shrink flex-grow overflow-hidden bg-gray-100 dark-mode:bg-gray-300 font-medium"
                    )}
                    style={{
                      WebkitUserSelect: "none",
                      opacity: blur ? "0.9" : 1,
                    }}
                  >
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

                        <Route path="/console">
                          <Console />
                        </Route>
                      </Switch>
                    </div>
                  </div>
                </Route>
              </Switch>
            </LastLocationProvider>
          </SpecificRouter>
        </ContainerProvider>
      </div>
    </div>
  );
};

const ContainerProvider = ({ children }) => (
  <NotificationsContainer.Provider>
    <ConfigContainer.Provider>
      <SelectionsContainer.Provider>
        <SketchesContainer.Provider>
          <UserContainer.Provider>
            <BuildsContainer.Provider>
              <SoulmateContainer.Provider>
                {children}
              </SoulmateContainer.Provider>
            </BuildsContainer.Provider>
          </UserContainer.Provider>
        </SketchesContainer.Provider>
      </SelectionsContainer.Provider>
    </ConfigContainer.Provider>
  </NotificationsContainer.Provider>
);

const HotMain = hot(module)((params) => <Main {...params} />);

export default HotMain;
