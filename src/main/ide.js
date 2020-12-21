import "react-resizable/css/styles.css";

import classnames from "classnames";
import React, { Suspense } from "react";
import { Route, Switch } from "react-router-dom";

import Notifications from "~/components/notifications";
import SketchesContainer from "~/containers/sketches";
import SoulmateContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";
import isElectron from "~/utils/isElectron";

import Config from "./config";
import Console from "./console";
import Dashboard from "./dashboard";
import Download from "./download";
import Editor from "./editor";
import Flash from "./flash";
import Gallery from "./gallery";
import Menu from "./menu";
import MySketches from "./mySketches";
import User from "./user";
import Welcome from "./welcome";

const IDE = () => {
  const [focus, setFocus] = useState(true);
  const blur = !focus;

  useEffect(() => {
    window.ipcRenderer?.on("focus", (event, isFocused) => setFocus(isFocused));
  }, [window, window.ipcRenderer]);

  return (
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
  );
};

const WrappedIde = (props) => (
  <SketchesContainer.Provider>
    <UserContainer.Provider>
      <SoulmateContainer.Provider>
        <IDE {...props} />
      </SoulmateContainer.Provider>
    </UserContainer.Provider>
  </SketchesContainer.Provider>
);

export default WrappedIde;
