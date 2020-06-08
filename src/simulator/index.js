import uniqBy from "lodash/uniqBy";
import Simulator from "./Simulator";
import { buildHex, getFullBuild } from "./compiler/compile";
import { prepareCode, prepareFullCode } from "./code";
import { hot } from "react-hot-loader";
import { MdAccountCircle } from "react-icons/md";
import "./index.css";
import React, { useRef, useState, useEffect } from "react";
import Editor from "./Editor";
import { Link, Router, Switch, Route } from "react-router-dom";
import { Mode, useLightSwitch } from "use-light-switch";
import { fetchJson, post, postDelete } from "./utils";
import { RiCloseCircleLine } from "react-icons/ri";
import List from "./List";
import { useAuth0 } from "../react-auth0-spa";
import history from "../utils/history";
import Logo from "./logo.svg";

import { useContainer } from "unstated-next";
import SketchesContainer from "./sketchesContainer";
import SoulmatesContainer from "./soulmatesContainer.js";
import UserContainer from "./userContainer.js";

const PatternEditor = ({ id }) => {
  const {
    sketches,
    allSketches,
    fetchSketches,
    save,
    createSketch,
    deleteSketch,
    reset,
    getSketch,
    buildSketch,
    builds,
  } = useContainer(SketchesContainer);
  const { soulmates, soulmate, setSoulmate } = useContainer(SoulmatesContainer);
  const { userDetails, fetchUser, login, logout } = useContainer(UserContainer);

  const mode = useLightSwitch();
  const [focus, setFocus] = useState(true);
  const loggedIn = !!userDetails;
  const build = builds[id];
  const selectedSketch = getSketch(id) || allSketches[0];

  useEffect(reset, [userDetails]);
  useEffect(() => {
    buildSketch(id);
  }, [id]);

  ipcRenderer.on("focus", (event, isFocused) => setFocus(isFocused));
  const { rows = 70, cols = 15 } = selectedSketch?.config || {};

  const add = async (name) => {
    const newSketch = await createSketch(name);
    history.push(`/${newSketch.id}`);
  };

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
        </div>
      </div>
      <div className="frame">
        <List
          sketches={sketches}
          allSketches={allSketches}
          selectedSketch={selectedSketch}
          loggedIn={loggedIn}
          add={add}
          destroy={deleteSketch}
          soulmates={soulmates}
          soulmate={soulmate}
          setSoulmate={setSoulmate}
          userDetails={userDetails}
          logout={logout}
          login={login}
        />
        {selectedSketch && (
          <Editor
            save={(code, config) => save(selectedSketch.id, code, config)}
            key={selectedSketch.id}
            code={selectedSketch.code}
            name={selectedSketch.name}
            config={selectedSketch.config || { rows, cols }}
            soulmate={soulmate}
            onBuild={(code) => {
              buildSketch(selectedSketch.id, code);
            }}
            // onFlash={didFlash}
          />
        )}
        {!selectedSketch && (
          <div className="welcome">
            <Logo className="loader" />
          </div>
        )}
        <div className="pixels">
          <div className="simulator">
            {!build && <Logo className="loader" />}

            {build && (
              <Simulator
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

export default () => (
  <Router history={history}>
    <Route
      path="/:id?"
      render={({
        match: {
          params: { id },
        },
      }) => <HotPatternEditor id={parseInt(id)} />}
    />
  </Router>
);
