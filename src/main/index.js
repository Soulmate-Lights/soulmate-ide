import "react-resizable/css/styles.css";

import classnames from "classnames";
import React, { Suspense } from "react";
import { hot } from "react-hot-loader";
import { HashRouter, Route, Router, Switch } from "react-router-dom";
import { LastLocationProvider } from "react-router-last-location";

import BuildsContainer from "~/containers/builds";
import NotificationsContainer from "~/containers/notifications";
import SketchesContainer from "~/containers/sketches";
import SoulmatesContainer from "~/containers/soulmates";
import Logo from "~/images/logo.svg";
import history from "~/utils/history";
import isElectron from "~/utils/isElectron";
import isMac from "~/utils/isMac";

const Marketing = React.lazy(() => import("../marketing"));
const Ide = React.lazy(() => import("./ide"));

const SpecificRouter = isElectron() ? HashRouter : Router;

const MainProvider = ({ children }) => (
  <SketchesContainer.Provider>
    <NotificationsContainer.Provider>
      <SoulmatesContainer.Provider>
        <BuildsContainer.Provider>{children}</BuildsContainer.Provider>
      </SoulmatesContainer.Provider>
    </NotificationsContainer.Provider>
  </SketchesContainer.Provider>
);

const Main = () => {
  const marketing =
    document.location.href === "https://www.soulmatelights.com/";

  const showTopBar = isMac() && isElectron();

  return (
    <div className="relative flex flex-col flex-grow h-full dark-mode:bg-gray-300 dark-mode:bg-gray-700">
      {showTopBar && (
        <div
          className={classnames("absolute w-full h-7 border-b ", {
            "bg-gray-200 dark-mode:bg-gray-700 border-gray-300 dark-mode:border-gray-600": focus,
            "bg-gray-100 dark-mode:bg-gray-600 dark-mode:border-gray-700": !focus,
          })}
          style={{ WebkitAppRegion: "drag" }}
        />
      )}

      <Suspense fallback={<Logo className="loading-spinner" />}>
        <div
          className={classnames("flex flex-grow flex-col flex-shrink h-full", {
            "pt-7": showTopBar,
          })}
        >
          <MainProvider>
            <SpecificRouter history={history}>
              <LastLocationProvider>
                <Switch>
                  <Route exact path={marketing ? "/" : "/marketing"}>
                    <Marketing />
                  </Route>

                  <Route>
                    <Ide />
                  </Route>
                </Switch>
              </LastLocationProvider>
            </SpecificRouter>
          </MainProvider>
        </div>
      </Suspense>
    </div>
  );
};

const HotMain = hot(module)((params) => <Main {...params} />);

export default HotMain;
