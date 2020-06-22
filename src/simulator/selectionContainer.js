import { createContainer } from "unstated-next";
import { useState } from "react";

const SelectionsContainer = () => {
  const [selections, setSelections] = useState({});

  const getSelection = (id) => {
    return selections[id];
  };

  const setSelection = (id, selection) => {
    const newSelections = { ...selections, [id]: selection };
    setSelections(newSelections);
  };

  return {
    getSelection,
    setSelection,
  };
};

export default createContainer(SelectionsContainer);
