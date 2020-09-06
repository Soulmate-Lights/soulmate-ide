import { useState } from "react";
import { createContainer } from "unstated-next";

const SelectionContainer = () => {
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

export default createContainer(SelectionContainer);
