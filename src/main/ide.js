import "react-resizable/css/styles.css";

import classnames from "classnames";
import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";

import Logo from "~/images/logo.svg";
import isElectron from "~/utils/isElectron";

const Config = React.lazy(() => import("./config"));
const Console = React.lazy(() => import("./console"));
const Dashboard = React.lazy(() => import("./dashboard"));
const Download = React.lazy(() => import("./download"));
const Editor = React.lazy(() => import("./editor"));
const Flash = React.lazy(() => import("./flash"));
const Gallery = React.lazy(() => import("./gallery"));
const Menu = React.lazy(() => import("./menu"));
const MySketches = React.lazy(() => import("./mySketches"));
const User = React.lazy(() => import("./user"));
const Welcome = React.lazy(() => import("./welcome"));

import Notifications from "~/components/notifications";
import ConfigContainer from "~/containers/config";
import NotificationsContainer from "~/containers/notifications";
import SelectionsContainer from "~/containers/selection";
import SketchesContainer from "~/containers/sketches";
import SoulmateContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";

const IDE = () => {
  useEffect(() => {
    window.ipcRenderer?.on("focus", (event, isFocused) => setFocus(isFocused));
  }, [window, window.ipcRenderer]);
  const [focus, setFocus] = useState(true);
  const blur = !focus;

  return (
    <ContainerProvider>
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

        <Suspense fallback={<Logo className="loading-spinner" />}>
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
                {isElectron() ? <Flash /> : <Download />}
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
        </Suspense>
      </div>
    </ContainerProvider>
  );
};

const ContainerProvider = ({ children }) => (
  <NotificationsContainer.Provider>
    <ConfigContainer.Provider>
      <SelectionsContainer.Provider>
        <SketchesContainer.Provider>
          <UserContainer.Provider>
            <SoulmateContainer.Provider>{children}</SoulmateContainer.Provider>
          </UserContainer.Provider>
        </SketchesContainer.Provider>
      </SelectionsContainer.Provider>
    </ConfigContainer.Provider>
  </NotificationsContainer.Provider>
);

export default IDE;
