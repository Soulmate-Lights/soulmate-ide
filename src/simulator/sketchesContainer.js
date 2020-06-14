import { createContainer } from "unstated-next";
import { buildHex } from "./compiler/compile";
import { fetchJson, post, postDelete } from "./utils";
import { useState } from "react";
import { prepareCode } from "./code";
import { getToken, loggedIn } from "./utils/auth";

const SketchesContainer = () => {
  const [sketches, setSketches] = useState(undefined);
  const [allSketches, setAllSketches] = useState(undefined);
  const [builds, setBuilds] = useState({});
  const [selectedSketches, setSelectedSketches] = useState([]);

  const getBuild = (sketch, config) => {
    if (!sketch) return;
    const key = `${sketch.id}-${config.rows}-${config.cols}`;
    return builds[key];
  };

  const toggleSketch = (sketch) => {
    if (selectedSketches.map((s) => s.id).includes(sketch.id)) {
      setSelectedSketches(selectedSketches.filter((s) => s.id !== sketch.id));
    } else {
      setSelectedSketches([...selectedSketches, sketch]);
    }
  };

  const fetchSketches = async () => {
    if (await loggedIn()) {
      const token = await getToken();
      const newSketches = await fetchJson("/sketches/list", token);
      setSketches(newSketches);
    }

    const newAllSketches = await fetchJson("/sketches/all");
    setAllSketches(newAllSketches);
  };

  const getSketch = (id) => {
    return (
      sketches?.find((s) => s.id === id) ||
      allSketches?.find((s) => s.id === id)
    );
  };

  const save = async (id, code, config) => {
    let sketchIndex = sketches?.findIndex((s) => s.id === id);
    if (sketchIndex > -1) {
      sketches[sketchIndex] = { ...sketches[sketchIndex], code, config };
      setSketches([...sketches]);

      const token = await getToken();
      post("/sketches/save", token, { id, code, config });
    }

    let allSketchIndex = allSketches?.findIndex((s) => s.id === id);
    if (allSketchIndex > -1) {
      allSketches[allSketchIndex] = {
        ...allSketches[allSketchIndex],
        code,
        config,
      };
      setAllSketches([...allSketches]);
    }
  };

  const rename = async (id, name) => {
    let sketchIndex = sketches?.findIndex((s) => s.id === id);
    if (!sketchIndex) return;
    const sketch = { ...sketches[sketchIndex], name };
    sketches[sketchIndex] = sketch;
    setSketches(sketches);
    const token = await getToken();
    post("/sketches/save", token, { id, name });
  };

  const createSketch = async (name) => {
    const token = await getToken();
    const newSketch = await post("/sketches/create", token, { name });
    await fetchSketches();
    return newSketch;
  };

  const deleteSketch = async (id) => {
    setSketches(sketches.filter((s) => s.id !== id));
    const token = await getToken();
    if (!token) return;
    await postDelete(`/sketches/${id}`, token);
    fetchSketches();
  };

  const reset = () => {
    setSketches(undefined);
    fetchSketches();
  };

  const buildSketch = async (id, code, config) => {
    if (!id) return;
    const sketch = getSketch(id);
    if (!sketch) return;

    const key = `${sketch.id}-${config.rows}-${config.cols}`;
    setBuilds({ ...builds, [key]: undefined });
    const { rows = 70, cols = 15 } = config;
    const preparedCode = prepareCode(code || sketch.code, rows, cols);
    const newBuild = await buildHex(preparedCode);
    setBuilds({ ...builds, [key]: newBuild });
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
    rename,
    selectedSketches,
    setSelectedSketches,
    toggleSketch,
    getBuild,
  };
};

export default createContainer(SketchesContainer);
