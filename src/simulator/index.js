import Simulator from "./Simulator";
import { GoDesktopDownload } from "react-icons/go";
import { hot } from "react-hot-loader";
import "./index.css";
import React, { useState, useEffect } from "react";
import Editor from "./Editor";
import { Router, Route, Switch } from "react-router-dom";
import { Mode, useLightSwitch } from "use-light-switch";
import List from "./List";
import history from "../utils/history";
import Logo from "./logo.svg";
import { useContainer } from "unstated-next";
import SketchesContainer from "./sketchesContainer";
import SoulmatesContainer from "./soulmatesContainer.js";
import UserContainer from "./userContainer.js";
import isElectron from "./utils/isElectron";
import Flash from "./Flash";

const PatternEditor = ({ id }) => {
  const { save, getSketch, getBuild } = useContainer(SketchesContainer);
  const { soulmate, flash, getConfig } = useContainer(SoulmatesContainer);
  const { userDetails, login, logout } = useContainer(UserContainer);
  const [focus, setFocus] = useState(true);
  const selectedSketch = getSketch(id);
  const config = (soulmate && getConfig(soulmate)) ||
    selectedSketch?.config || { rows: 70, cols: 15 };
  const { rows = 70, cols = 15 } = config;
  const build = getBuild(selectedSketch, config);
  const [flashMode, setFlashMode] = useState(false);

  useEffect(() => {
    window.ipcRenderer?.on("focus", (event, isFocused) => setFocus(isFocused));
  }, []);

  const mode = useLightSwitch();
  const appClass = `
    ${mode === Mode.Dark && "dark"}
    ${focus ? "focus" : "blur"}`;

  return (
    <div className={`app-wrapper ${appClass}`}>
      <div className="titlebar">
        <span className="title">Soulmate</span>
        <div className="user">
          {userDetails?.name ? (
            <>
              <img src={userDetails?.picture} />
              {userDetails?.name}
              <a className="logout button" onClick={logout}>
                Log out
              </a>
            </>
          ) : (
            <div onClick={login} className="new button">
              Log in
            </div>
          )}
          {!isElectron() && (
            <a className="button" href="/download">
              <GoDesktopDownload style={{ fill: "inherit" }} />
              Download the app
            </a>
          )}
        </div>
      </div>
      <div className="frame">
        <List
          selectedSketch={selectedSketch}
          userDetails={userDetails}
          flashMode={flashMode}
          setFlashMode={setFlashMode}
        />

        <div className="app-container">
          {!selectedSketch && (
            <div className="welcome">
              <Logo className="loader" />
            </div>
          )}
          {selectedSketch && !flashMode && (
            <Editor
              key={selectedSketch.id}
              sketch={selectedSketch}
              build={build}
            />
          )}

          {flashMode && <Flash id={id} />}
        </div>

        {selectedSketch && (
          <div className="pixels">
            <Simulator
              key={`${selectedSketch.id}-${rows}-${cols}`}
              build={build}
              cols={cols}
              rows={rows}
              width={cols * 10}
              height={rows * 10}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const HotPatternEditor = hot(module)((params) => (
  <SketchesContainer.Provider>
    <UserContainer.Provider>
      <SoulmatesContainer.Provider>
        <PatternEditor {...params} />
      </SoulmatesContainer.Provider>
    </UserContainer.Provider>
  </SketchesContainer.Provider>
));

const RoutedEditor = () => (
  <Router history={history}>
    <Switch>
      <Route path="/auth">
        <div></div>
      </Route>
      <Route
        path="/:id?"
        render={({
          match: {
            params: { id },
          },
        }) => <HotPatternEditor id={parseInt(id)} />}
      />
    </Switch>
  </Router>
);

export default RoutedEditor;
