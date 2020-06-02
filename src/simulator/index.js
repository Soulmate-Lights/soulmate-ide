import uniqBy from 'lodash/uniqBy';
import "./index.css";
import { createBrowserHistory } from "history";
import React, { useRef, useState, useEffect } from "react";
import Editor from "./Editor";
import { Link, Router, Switch, Route } from "react-router-dom";
import { Mode, useLightSwitch } from "use-light-switch";
import { fetchJson, post, postDelete } from "./utils";
import List from "./List";

const history = createBrowserHistory();

const PatternEditor = ({ id }) => {
  const mode = useLightSwitch();
  const dark = mode === Mode.Dark;
  const loggedIn = false; //  document.querySelector("[name=logged-in]");
  const [sketches, setSketches] = useState([]);
  const selectedSketch = sketches.find((s) => s.id === id) || sketches[0];

  const [soulmates, setSoulmates] = useState([]);
  const [soulmate, setSoulmate] = useState(false);

  ipcRenderer.on('soulmate', (event, arg) => {
    let newSoulmates = [...soulmates, arg];
    newSoulmates = uniqBy(newSoulmates, 'name');
    setSoulmates(newSoulmates);
  })

  useEffect(() => {
    ipcRenderer.send('scan', {});
  }, [])

  const fetchSketches = () => {
    return fetchJson("/sketches/list").then(setSketches);
  };

  useEffect(() => {
    fetchSketches();
  }, []);

  const add = () => {
    const name = prompt("New sketch name:");
    if (!name) return;
    post("/sketches/create", { name }).then((newSketch) => {
      fetchSketches().then(() => history.push(`/${newSketch.id}`));
    });
  };

  const save = (id, code) => {
    sketches.find((s) => s.id === id).code = code;
    setSketches(sketches);

    loggedIn && post("/sketches/save", { id, code }).then(fetchSketches);
  };

  const destroy = (id) => {
    if (!loggedIn) return;
    if (!confirm('Delete this sketch?')) return;
    postDelete(`/sketches/${id}`).then(() => fetchSketches());
  };

  let interval = useRef();
  useEffect(() => {
    setInterval(() => {
      interval.current = fetchSketches();
    }, 8000);

    return () => {
      clearInterval(interval.current);
    }
  }, [])

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
