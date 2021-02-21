import "react-resizable/css/styles.css";

import classnames from "classnames";
import React, { Suspense } from "react";
import { Helmet } from "react-helmet";
import { FiSettings } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { IoMenuSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Route, Switch } from "react-router-dom";

import ErrorNotification from "~/components/ErrorNotification";
import Menu from "~/components/Menu";
import Notifications from "~/components/notifications";
import ConfigContainer from "~/containers/config";
import SoulmatesContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import useSWR, { mutate } from "~/hooks/useSwr";
import Logo from "~/images/logo.svg";
import history from "~/utils/history";
import isElectron from "~/utils/isElectron";
import { ALL_SKETCHES_PATH, SKETCHES_PATH } from "~/utils/network";

import ErrorBoundary from "./components/ErrorBoundary";
import Config from "./config";
import Console from "./console";
import Dashboard from "./dashboard";
import Download from "./download";
import Editor from "./editor";
import Flash from "./flash";
import Gallery from "./gallery";
import MySketches from "./mySketches";
import NewPlaylist from "./newPlaylist";
import Playlist from "./playlist";
import Playlists from "./playlists";
import Settings from "./Settings";
import User from "./user";
import Welcome from "./welcome";

const IDE = () => {
  useSWR(SKETCHES_PATH);
  useSWR(ALL_SKETCHES_PATH);

  UserContainer.useContainer();
  const {
    needsSetup,
    port,
    error,
    setError,
  } = SoulmatesContainer.useContainer();

  const [focus, setFocus] = useState(true);
  const blur = !focus;

  const [showMenu, setShowMenu] = useState(false);
  history.listen(() => setShowMenu(false));

  useEffect(() => {
    window.ipcRenderer?.on("focus", (event, isFocused) => setFocus(isFocused));
  }, [window, window.ipcRenderer]);

  return (
    <div className="flex flex-col flex-grow flex-shrink overflow-hidden">
      <Helmet titleTemplate="%s | Soulmate IDE">
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
      </Helmet>
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
            <div className="hidden lg:flex">
              <Menu />
            </div>

            <Menu
              className={[
                "transform fixed z-50 h-full lg:hidden ease-in-out transition-all duration-300",
                showMenu ? "translate-x-0" : "-translate-x-full",
              ]}
              style={{ opacity: 0.5 }}
            />

            <Notifications />

            <ErrorBoundary>
              <Suspense fallback={<Logo className="loading-spinner" />}>
                <div className="relative flex flex-row flex-grow flex-shrink w-full min-w-0 bg-gray-100 dark-mode:bg-gray-800 dark-mode:text-white">
                  <div
                    className={classnames(
                      "absolute z-20 flex top-3 z-8 lg:hidden",
                      { "left-64": showMenu }
                    )}
                  >
                    <a
                      className="relative flex inline-flex items-center h-10 px-4 ml-4 font-medium text-gray-800 bg-white border border-gray-300 cursor-pointer lg:hidden text-md leading-5 rounded-md hover:text-gray-800 hover:bg-purple-50 ()):outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out z-8"
                      onClick={() => setShowMenu(!showMenu)}
                    >
                      <span>{!showMenu ? <IoMenuSharp /> : <GrClose />}</span>
                    </a>
                  </div>

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

                    <Route exact path="/settings">
                      <Settings />
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

                    <Route path="/playlists/new">
                      <NewPlaylist />
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
  <UserContainer.Provider>
    <ConfigContainer.Provider>
      <IDE {...props} />
    </ConfigContainer.Provider>
  </UserContainer.Provider>
);

export default WrappedIde;
