import { fetchJson, post, postDelete } from "~/utils";
import { getToken, loggedIn } from "~/utils/auth";

import { createContainer } from "unstated-next";
import { useState } from "react";

const SketchesContainer = () => {
  const [sketches, setSketches] = useState(undefined);
  const [allSketches, setAllSketches] = useState(undefined);
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
    id = parseInt(id);
    return (
      sketches?.find((s) => s.id === id) ||
      allSketches?.find((s) => s.id === id)
    );
  };

  // Sketch actions

  const cloneSketch = async (sketch) => {
    const name = `Copy of ${sketch.name}`;
    const code = sketch.code;
    const token = await getToken();
    const newSketch = await post("/sketches/create", token, { name, code });
    await fetchSketches();
    return newSketch;
  };

  const persistCode = (id, code) => {
    if (!id) return;
    updateSketch(id, {
      dirtyCode: code,
      dirty: getSketch(id).code !== code,
    });
  };

  const togglePublic = async (id) => {
    const sketch = sketches.find((s) => s.id === id);
    const isPublic = !sketch.public;
    updateSketch(id, { public: isPublic });
    const token = await getToken();
    await post("/sketches/save", token, { id, public: isPublic });
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

  return {
    allSketches,
    cloneSketch,
    createSketch,
    deleteSketch,
    fetchSketches,
    getSketch,
    persistCode,
    rename,
    reset,
    save,
    selectedSketches,
    setSelectedSketches,
    sketches,
    sketchIsMine,
    togglePublic,
    toggleSketch,
  };
};

export default createContainer(SketchesContainer);
