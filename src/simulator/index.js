import uniqBy from "lodash/uniqBy";
import { hot } from "react-hot-loader";
import { MdAccountCircle } from "react-icons/md";
import "./index.css";
import React, { useRef, useState, useEffect } from "react";
import Editor from "./Editor";
import { Link, Router, Switch, Route } from "react-router-dom";
import { Mode, useLightSwitch } from "use-light-switch";
import { fetchJson, post, postDelete } from "./utils";
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

  const save = async (id, code) => {
    if (loggedIn && sketches) {
      const sketch = sketches.find((s) => s.id === id);

      if (sketch) {
        sketch.code = code;
        setSketches(sketches);
        const token = await auth.getToken();
        post("/sketches/save", token, { id, code }).then(fetchSketches);
      }
    }

    if (allSketches) {
      const sketch = allSketches.find((s) => s.id === id);

      if (sketch) {
        debugger;
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
            save={(code) => save(selectedSketch.id, code)}
            key={selectedSketch.id}
            code={selectedSketch.code}
            name={selectedSketch.name}
            soulmate={soulmate}
          />
        )}
        {!selectedSketch && (
          <div className="welcome">
            <Logo className="loader" />
          </div>
        )}
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
