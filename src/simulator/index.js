import uniqBy from "lodash/uniqBy";
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

const PatternEditor = ({ id }) => {
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;

  const [sketches, setSketches] = useState([]);
  const selectedSketch = sketches.find((s) => s.id === id) || sketches[0];

  const [soulmates, setSoulmates] = useState([]);
  const [soulmate, setSoulmate] = useState(false);

  const [userDetails, setUserDetails] = useState(false);
  const loggedIn = !!userDetails;

  ipcRenderer.on("soulmate", (event, arg) => {
    let newSoulmates = [...soulmates, arg];
    newSoulmates = uniqBy(newSoulmates, "name");
    setSoulmates(newSoulmates);
  });

  const getUserDetails = async () => {
    const id_token = auth.tokenProperties?.id_token;
    let newUserDetails = false;
    if (id_token) newUserDetails = jwtDecode(id_token);
    setUserDetails(newUserDetails);
  };

  useEffect(() => {
    getUserDetails();
  }, [auth.tokenProperties?.id_token]);

  useEffect(() => {
    ipcRenderer.send("scan", {});
  }, []);

  const fetchSketches = async () => {
    let token;
    if (auth.tokenProperties) {
      token = await auth.getToken();
      return fetchJson("/sketches/list", token).then(setSketches);
    }
    return fetchJson("/sketches/list").then(setSketches);
  };

  useEffect(() => {
    fetchSketches();
  }, [userDetails]);

  const add = async () => {
    const name = await promptFor({
      title: "New sketch",
      label: "Sketch name:",
      value: "",
      inputAttrs: {
        type: "text",
      },
      type: "input",
      icon: __dirname + "/icon.png",
    });
    token = await auth.getToken();
    post("/sketches/create", token, { name }).then((newSketch) => {
      fetchSketches().then(() => history.push(`/${newSketch.id}`));
    });
  };

  const save = (id, code) => {
    sketches.find((s) => s.id === id).code = code;
    setSketches(sketches);

    loggedIn && post("/sketches/save", { id, code }).then(fetchSketches);
  };

  const destroy = async (id) => {
    if (!loggedIn) return;
    if (!confirm("Delete this sketch?")) return;

    token = await auth.getToken();
    postDelete(`/sketches/${id}`, token).then(() => fetchSketches());
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

  return (
    <div className={`frame ${dark && "dark"}`}>
      <List
        sketches={sketches}
        selectedSketch={selectedSketch}
        loggedIn={loggedIn}
        add={add}
        destroy={destroy}
        soulmates={soulmates}
        soulmate={soulmate}
        setSoulmate={setSoulmate}
        userDetails={userDetails}
        logout={async () => {
          await auth.logout();
          getUserDetails();
        }}
        login={async () => {
          await auth.login();
          getUserDetails();
        }}
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
          Welcome to the Soulmate editor!
          <button className="new" onClick={add}>
            New sketch
          </button>
        </div>
      )}
    </div>
  );
};

export default () => (
  <Router history={history}>
    <Route
      path="/:id?"
      render={({
        match: {
          params: { id },
        },
      }) => <PatternEditor id={parseInt(id)} />}
    />
  </Router>
);
