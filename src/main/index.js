import "react-resizable/css/styles.css";

import classnames from "classnames";
import React, { Suspense } from "react";
import Helmet from "react-helmet";
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
    <>
    <Helmet>
    <meta charset="UTF-8" />
    <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    <meta content="ie=edge" httpEquiv="X-UA-Compatible" />

    <link
      href="/favicon/apple-touch-icon.png?v=yy4kWGR0d4"
      rel="apple-touch-icon"
      sizes="180x180"
    />
    <link
      href="/favicon/favicon-32x32.png?v=yy4kWGR0d4"
      rel="icon"
      sizes="32x32"
      type="image/png"
    />
    <link
      href="/favicon/favicon-16x16.png?v=yy4kWGR0d4"
      rel="icon"
      sizes="16x16"
      type="image/png"
    />
    {/* <!-- <link rel="manifest" href="url:/favicon/site.webmanifest?v=yy4kWGR0d4" /> --> */}
    <link
      color="#292827"
      href="/favicon/safari-pinned-tab.svg?v=yy4kWGR0d4"
      rel="mask-icon"
    />
    <link href="/favicon/favicon.ico?v=yy4kWGR0d4" rel="shortcut icon" />
    <meta content="#292827" name="msapplication-TileColor" />
    <meta
      content="/favicon/browserconfig.xml?v=yy4kWGR0d4"
      name="msapplication-config"
    />
    <meta content="#292827" name="theme-color" />

    <title>Soulmate</title>

    {/* <!-- Global site tag (gtag.js) - Google Analytics --> */}
    <script
      async
      src="https://www.googletagmanager.com/gtag/js?id=UA-131034779-4"
    ></script>

    <meta content="yes" name="apple-mobile-web-app-capable" />
    <meta content="black" name="apple-mobile-web-app-status-bar-style" />

    <meta
      content="https://www.soulmatelights.com/hand.d472bfdb.jpg"
      property="og:image"
    />

    <meta
      content="Soulmate - a lighting platform for everybody"
      property="og:title"
    />
    <meta content="Soulmate" property="og:site_name" />
    <meta content="https://www.soulmatelights.com" property="og:url" />
    <meta
      content="Soulmate is the easiest way to work with LEDs. Whether you’re building an LED panel, lighting your room with an LED strip, or just writing C++, try Soulmate free today."
      property="og:description"
    />
    <meta content="product" property="og:type" />

    <meta id="viewport" name="viewport" />
    </Helmet>
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
    </>
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
