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

const PatternEditor = ({ id }) => {
  const { save, reset, getSketch, builds } = useContainer(SketchesContainer);
  const { soulmate, flash } = useContainer(SoulmatesContainer);
  const { userDetails, login, logout } = useContainer(UserContainer);
  const [focus, setFocus] = useState(true);
  const selectedSketch = getSketch(id);
  const build = builds[selectedSketch?.id];
  const { rows = 70, cols = 15 } = selectedSketch?.config || {};

  // TODO: Figure this out - called twice on page load when the user's logged in
  useEffect(reset, [userDetails]);

  useEffect(() => {
    window.ipcRenderer?.on("focus", (event, isFocused) => setFocus(isFocused));
  }, []);

  const mode = useLightSwitch();
  const appClass = `
    ${mode === Mode.Dark && "dark"}
    ${focus ? "focus" : "blur"}`;

  window.build = build;

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
        <List selectedSketch={selectedSketch} userDetails={userDetails} />
        {selectedSketch && (
          <Editor
            key={selectedSketch.id}
            save={(code, config) => {
              save(selectedSketch.id, code, config);
            }}
            sketch={selectedSketch}
            config={selectedSketch.config || { rows, cols }}
            soulmate={soulmate}
            build={build}
            flash={flash}
          />
        )}
        {!selectedSketch && (
          <div className="welcome">
            <Logo className="loader" />
          </div>
        )}
        <div className="pixels">
          <div className="simulator">
            {!build && (
              <div
                style={{
                  width: cols * 10,
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Logo className="loader" />
              </div>
            )}

            {build && (
              <Simulator
                key={selectedSketch.id}
                build={build}
                cols={cols}
                rows={rows}
                width={cols * 10}
                height={rows * 10}
              />
            )}
          </div>
          {build?.stderr && (
            <div className="compiler-output">
              <pre id="compiler-output-text">{build.stderr}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HotPatternEditor = hot(module)((params) => (
  <UserContainer.Provider>
    <SketchesContainer.Provider>
      <SoulmatesContainer.Provider>
        <PatternEditor {...params} />
      </SoulmatesContainer.Provider>
    </SketchesContainer.Provider>
  </UserContainer.Provider>
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
