import { createContainer } from "unstated-next";
import { buildHex } from "../compiler/compile";
import { fetchJson, post, postDelete } from "../utils";
import { useState } from "react";
import { preparePreviewCode } from "../utils/code";
import { getToken, loggedIn } from "../utils/auth";

const SketchesContainer = () => {
  const [sketches, setSketches] = useState(undefined);
  const [allSketches, setAllSketches] = useState(undefined);
  const [builds, setBuilds] = useState({});
  const [selectedSketches, setSelectedSketches] = useState([]);

  const sketchIsMine = (sketch) => {
    return sketches?.findIndex((s) => s.id === sketch.id) > -1;
  };

  // Update a sketch locally (don't save)
  const updateSketch = (id, options) => {
    if (sketches) {
      let sketchIndex = sketches?.findIndex((s) => s.id === id);
      if (sketchIndex > -1) {
        sketches[sketchIndex] = { ...sketches[sketchIndex], ...options };
        setSketches([...sketches]);
      }
    }

    let allSketchIndex = allSketches?.findIndex((s) => s.id === id);
    if (allSketchIndex > -1) {
      allSketches[allSketchIndex] = {
        ...allSketches[allSketchIndex],
        ...options,
      };
      setAllSketches([...allSketches]);
    }
  };

  // Multi-select is handled here

  const toggleSketch = (sketch) => {
    if (selectedSketches.map((s) => s.id).includes(sketch.id)) {
      setSelectedSketches(selectedSketches.filter((s) => s.id !== sketch.id));
    } else {
      setSelectedSketches([...selectedSketches, sketch]);
    }
  };

  // Accessors

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

  // Sketch actions

  const persistCode = (id, code) => {
    updateSketch(id, {
      dirtyCode: code,
      dirty: getSketch(id).code !== code,
    });
  };

  const save = async (id, code, config) => {
    updateSketch(id, { code, dirtyCode: undefined, config, dirty: false });

    let sketchIndex = sketches?.findIndex((s) => s.id === id);
    if (sketchIndex > -1) {
      const token = await getToken();
      await post("/sketches/save", token, { id, code, config });
    }
  };

  const rename = async (id, name) => {
    updateSketch(id, { name });
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

  // Happens when we log in

  const reset = () => {
    setSketches(undefined);
    fetchSketches();
  };

  // Builds

  const getBuild = (sketch, config) => {
    if (!sketch) return;
    const key = `${sketch.id}-${config.rows}-${config.cols}`;
    return builds[key];
  };

  const buildSketch = async (id, code, config) => {
    if (!id) return;
    const sketch = getSketch(id);
    if (!sketch) return;

    const key = `${sketch.id}-${config.rows}-${config.cols}`;
    setBuilds({ ...builds, [key]: undefined });
    const { rows = 14, cols = 14 } = config;
    const preparedCode = preparePreviewCode(code || sketch.code, rows, cols);
    const newBuild = await buildHex(preparedCode);
    setBuilds({ ...builds, [key]: newBuild });
  };

  return {
    sketches,
    allSketches,
    sketchIsMine,
    fetchSketches,
    createSketch,
    deleteSketch,
    reset,
    getSketch,
    buildSketch,
    builds,
    save,
    persistCode,
    rename,
    selectedSketches,
    setSelectedSketches,
    toggleSketch,
    getBuild,
  };
};

export default createContainer(SketchesContainer);
