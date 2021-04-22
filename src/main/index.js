import "react-resizable/css/styles.css";

import classnames from "classnames";
import React, { Suspense } from "react";
import { HashRouter, Route, Router, Switch } from "react-router-dom";
import { LastLocationProvider } from "react-router-last-location";

import NetworkContainer from "~/containers/network";
import NotificationsContainer from "~/containers/notifications";
import SoulmatesContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";
import history from "~/utils/history";
import isElectron from "~/utils/isElectron";
import isMac from "~/utils/isMac";

const Blog = React.lazy(() => import('../blog'));
const Marketing = React.lazy(() => import("../marketing"));
const Ide = React.lazy(() => import("./ide"));

const SpecificRouter = isElectron() ? HashRouter : Router;

history.listen((location) => {
  window.ga('set', 'page', location.pathname + location.search);
  window.ga('send', 'pageview');
});

const Main = () => {
  const href = document.location.href;
  const marketing = href === "https://www.soulmatelights.com/";
  const showTopBar = isMac() && isElectron();

  return (
    <div className="relative flex flex-col flex-grow h-full dark-mode:bg-gray-700">
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
          <SpecificRouter history={history}>
            <LastLocationProvider>
              <Switch>
                <Route path={marketing ? "/" : "/marketing"}>
                  <Marketing />
                </Route>

                <Route path="/blog/*">
                  <Blog />
                </Route>

                <Route>
                  <Ide />
                </Route>
              </Switch>
            </LastLocationProvider>
          </SpecificRouter>
        </div>
      </Suspense>
    </div>
  );
};

const WrappedMain = () => (
  <NetworkContainer.Provider>
    <NotificationsContainer.Provider>
      <SoulmatesContainer.Provider>
        <UserContainer.Provider>
          <Main />
        </UserContainer.Provider>
      </SoulmatesContainer.Provider>
    </NotificationsContainer.Provider>
  </NetworkContainer.Provider>
);

export default WrappedMain;
