import { createContainer } from "unstated-next";
import { buildHex, getFullBuild } from "./compiler/compile";
import { fetchJson, post, postDelete } from "./utils";
import React, { useState, useEffect } from "react";
import { prepareCode, prepareFullCode } from "./code";

const SketchesContainer = () => {
  const [sketches, setSketches] = useState(undefined);
  const [allSketches, setAllSketches] = useState(undefined);
  const [builds, setBuilds] = useState({});

  const fetchSketches = async () => {
    let token;
    fetchJson("/sketches/list").then((allSketches) => {
      setAllSketches(allSketches);
    });

    if (auth.tokenProperties) {
      token = await auth.getToken();
      fetchJson("/sketches/list", token).then(setSketches);
    }
  };

  // let interval = useRef();
  // useEffect(() => {
  //   interval.current = setInterval(() => {
  //     fetchSketches();
  //   }, 8000);

  //   return () => {
  //     clearInterval(interval.current);
  //   };
  // }, []);

  const getSketch = (id) => {
    try {
      return (
        sketches.find((s) => s.id === id) ||
        allSketches.find((s) => s.id === id)
      );
    } catch (e) {
      return false;
    }
  };

  const save = async (id, code, config) => {
    const sketch = sketches?.find((s) => s.id === id);

    let sketchIndex = sketches.findIndex((s) => s.id === id);
    if (sketchIndex > -1) {
      sketches[sketchIndex] = { ...sketches[sketchIndex], code, config };
      setSketches(sketches);
    }

    let allSketchIndex = allSketches.findIndex((s) => s.id === id);
    if (allSketchIndex > -1) {
      allSketches[allSketchIndex] = {
        ...allSketches[allSketchIndex],
        code,
        config,
      };
      setAllSketches(allSketches);
    }

    // TODO: Update sketch in state
    if (sketch) {
      sketch.code = code;
      const token = await auth.getToken();
      post("/sketches/save", token, { id, code, config }).then(fetchSketches);
    }

    const publicSketch = allSketches?.find((s) => s.id === id);
    if (publicSketch) {
      publicSketch.code = code;
      setAllSketches(allSketches);
    }
  };

  const createSketch = async (name) => {
    const token = await auth.getToken();
    const newSketch = await post("/sketches/create", token, { name });
    await fetchSketches();
    return newSketch;
  };

  const deleteSketch = async (id) => {
    setSketches(sketches.filter((s) => s.id !== id));

    const token = await auth.getToken();
    if (!token) return;
    if (!confirm("Delete this sketch?")) return;
    await postDelete(`/sketches/${id}`, token);
    fetchSketches();
  };

  const reset = () => {
    setSketches(undefined);
    fetchSketches();
  };

  const buildSketch = async (id, code) => {
    // todo: debug this
    if (!code) return;

    builds[id] = undefined;
    setBuilds({ ...builds });

    const sketch = getSketch(id);
    if (!sketch) return;
    const config = sketch.config || {};
    const { rows = 70, cols = 15 } = config;
    const preparedCode = prepareCode(code, rows, cols);
    const newBuild = await buildHex(preparedCode);
    builds[id] = newBuild;
    setBuilds({ ...builds });
  };

  return {
    sketches,
    allSketches,
    fetchSketches,
    createSketch,
    deleteSketch,
    reset,
    getSketch,
    buildSketch,
    builds,
    save,
  };
};

export default createContainer(SketchesContainer);
