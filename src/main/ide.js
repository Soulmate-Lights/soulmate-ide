import "react-resizable/css/styles.css";

import classnames from "classnames";
import React, { Suspense } from "react";
import { FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import { SWRConfig } from "swr";
import useSWR from "swr";

import ErrorNotification from "~/components/ErrorNotification";
import Notifications from "~/components/notifications";
import SoulmatesContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import Logo from "~/images/logo.svg";
import { fetcher } from "~/utils";
import isElectron from "~/utils/isElectron";
import { ALL_SKETCHES_URL, SKETCHES_URL } from "~/utils/urls";

import ErrorBoundary from "./components/ErrorBoundary";
import Config from "./config";
import Console from "./console";
import Dashboard from "./dashboard";
import Download from "./download";
import Editor from "./editor";
import Flash from "./flash";
import Gallery from "./gallery";
import Menu from "./menu";
import MySketches from "./mySketches";
import Playlist from "./playlist";
import Playlists from "./playlists";
import User from "./user";
import Welcome from "./welcome";

const IDE = () => {
  useSWR(SKETCHES_URL);
  useSWR(ALL_SKETCHES_URL);

  UserContainer.useContainer();
  const {
    needsSetup,
    port,
    error,
    setError,
  } = SoulmatesContainer.useContainer();

  const [focus, setFocus] = useState(true);
  const blur = !focus;

  useEffect(() => {
    window.ipcRenderer?.on("focus", (event, isFocused) => setFocus(isFocused));
  }, [window, window.ipcRenderer]);

  return (
    <div className="flex flex-col flex-grow flex-shrink overflow-hidden">
      <Switch>
        <Route path="/desktop-sign-in">
          <Logo className="loading-spinner" />
        </Route>
        <Route path="/desktop-callback">
          <div className="flex flex-col items-center justify-center flex-grow w-full h-full space-y-8 dark-mode:text-white">
            <Logo />
            <span className="flex">All set. You can close this window.</span>
          </div>
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

            <ErrorBoundary>
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

                    <Route
                      path="/playlists/:id"
                      render={({
                        match: {
                          params: { id },
                        },
                      }) => <Playlist id={id} />}
                    />

                    <Route path="/playlists">
                      <Playlists />
                    </Route>
                  </Switch>
                </div>
              </Suspense>
            </ErrorBoundary>
          </div>
        </Route>
      </Switch>

      <Switch>
        <Route path="/config" />
        <Route>
          {needsSetup && (
            <div className="flex items-center flex-grow-0 px-4 text-sm border-t border-gray-200 align-center dark-mode:border-gray-600">
              <Logo className="w-6 ml-2 mr-6" />
              <span className="leading-6 dark-mode:text-white">
                A new Soulmate is connected to <strong>{port}</strong>.
                <br />
                Click &ldquo;Configure my Soulmate&rdquo; to get started
              </span>
              <Link className="h-12 px-4 ml-auto footer-button" to="/config">
                <FiSettings className="mr-2" />
                Configure my Soulmate
              </Link>
            </div>
          )}
        </Route>
      </Switch>

      {error && (
        <ErrorNotification dismiss={() => setError(false)} trace={error} />
      )}
    </div>
  );
};

const WrappedIde = (props) => (
  <SWRConfig value={{ fetcher }}>
    <UserContainer.Provider>
      <IDE {...props} />
    </UserContainer.Provider>
  </SWRConfig>
);

export default WrappedIde;
