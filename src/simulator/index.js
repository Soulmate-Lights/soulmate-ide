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
import jwtDecode from "jwt-decode";
import Logo from "./logo.svg";

const PatternEditor = ({ id }) => {
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;

  const [allSketches, setAllSketches] = useState();
  const [sketches, setSketches] = useState();
  const [focus, setFocus] = useState(true);
  const [soulmates, setSoulmates] = useState([]);
  const [soulmate, setSoulmate] = useState(false);
  const [userDetails, setUserDetails] = useState(false);
  const loggedIn = !!userDetails;

  const combinedSketches = [...(sketches || []), ...(allSketches || [])];

  const [builds, setBuilds] = useState({});
  const build = builds[id];

  const setBuild = (id, build) => {
    builds[id] = build;
    setBuilds(builds);
  };

  const onBuild = async (id, code) => {
    if (!id) return;
    setBuild(id, undefined);
    const sketch = combinedSketches.find((s) => s.id === id);
    if (!sketch) return;
    const config = sketch.config;
    const { rows = 70, cols = 15 } = config;
    const preparedCode = prepareCode(code, rows, cols);
    const newBuild = await buildHex(preparedCode);
    setBuild(id, newBuild);
  };

  const selectedSketch =
    combinedSketches?.find((s) => s.id === id) || combinedSketches[0];

  ipcRenderer.on("focus", (event, isFocused) => {
    setFocus(isFocused);
  });

  ipcRenderer.on("soulmate", (event, arg) => {
    let newSoulmates = [...soulmates, arg];
    newSoulmates = uniqBy(newSoulmates, "name");
    setSoulmates(newSoulmates);
  });

  const getUserDetails = async () => {
    const id_token = auth.tokenProperties?.id_token;
    let newUserDetails = false;
    if (id_token) {
      newUserDetails = jwtDecode(id_token);
      localStorage.loginSaved = "true";
    }
    setUserDetails(newUserDetails);
  };

  useEffect(() => {
    getUserDetails();
  }, [auth.tokenProperties?.id_token]);

  useEffect(() => {
    ipcRenderer.send("scan", {});
  }, []);

  useEffect(() => {
    if (localStorage.loginSaved) {
      auth.getToken().then(() => {
        getUserDetails();
      });
    }
  }, []);

  const fetchSketches = async () => {
    let token;

    fetchJson("/sketches/list").then((allSketches) => {
      setAllSketches(allSketches);
    });

    if (auth.tokenProperties) {
      token = await auth.getToken();
      const newSketches = await fetchJson("/sketches/list", token);
      setSketches(newSketches);
      return;
    }
    return fetchJson("/sketches/list").then(setSketches);
  };

  useEffect(() => {
    setSketches(undefined);
    fetchSketches();
  }, [userDetails]);

  const add = async (name) => {
    const token = await auth.getToken();
    const newSketch = await post("/sketches/create", token, { name });
    await fetchSketches();
    history.push(`/${newSketch.id}`);
  };

  const save = async (code, config) => {
    const id = selectedSketch.id;

    console.log(id, config);

    if (loggedIn && sketches) {
      const sketch = sketches.find((s) => s.id === id);

      if (sketch) {
        sketch.code = code;
        setSketches(sketches);
        const token = await auth.getToken();
        post("/sketches/save", token, { id, code, config }).then(fetchSketches);
      }
    }

    if (allSketches) {
      const sketch = allSketches.find((s) => s.id === id);

      if (sketch) {
        sketch.code = code;
        setAllSketches(allSketches);
      }
    }
  };

  const destroy = async (id) => {
    if (!loggedIn) return;
    if (!confirm("Delete this sketch?")) return;

    const token = await auth.getToken();
    await postDelete(`/sketches/${id}`, token);
    fetchSketches();
  };

  let interval = useRef();
  useEffect(() => {
    interval.current = setInterval(() => {
      fetchSketches();
    }, 8000);

    return () => {
      clearInterval(interval.current);
    };
  }, []);

  const login = async () => {
    await auth.login();
    getUserDetails();
  };

  const logout = async () => {
    delete localStorage.loginSaved;
    await auth.logout();
    getUserDetails();
  };

  const updateSketch = (code) => {
    const sketchIndex = sketches.findIndex(
      (sketch) => sketch.id === selectedSketch.id
    );
    if (sketchIndex === -1) return;
    sketches[sketchIndex].code = code;
    setSketches([...sketches]);
  };

  const { rows = 70, cols = 15 } = selectedSketch?.config || {};

  return (
    <div
      className={`app-wrapper ${dark && "dark"} ${focus ? "focus" : "blur"}`}
    >
      <div className="titlebar">
        <span className="title">Soulmate</span>
        <div className="user">
          {userDetails.name ? (
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
          destroy={destroy}
          soulmates={soulmates}
          soulmate={soulmate}
          setSoulmate={setSoulmate}
          userDetails={userDetails}
          logout={logout}
          login={login}
        />
        {selectedSketch && (
          <Editor
            save={save}
            key={selectedSketch.id}
            code={selectedSketch.code}
            name={selectedSketch.name}
            config={selectedSketch.config || { rows, cols }}
            soulmate={soulmate}
            onBuild={(code) => {
              onBuild(selectedSketch.id, code);
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
                key={id}
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

const HotPatternEditor = hot(module)(PatternEditor);

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
