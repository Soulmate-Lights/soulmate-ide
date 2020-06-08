import { createContainer } from "unstated-next";
import uniqBy from "lodash/uniqBy";
import { fetchJson, post, postDelete } from "./utils";
import React, { useState, useEffect } from "react";

const SoulmatesContainer = () => {
  const [soulmates, setSoulmates] = useState([]);
  const [soulmate, setSoulmate] = useState(undefined);

  ipcRenderer.on("soulmate", (event, arg) => {
    let newSoulmates = [...soulmates, arg];
    newSoulmates = uniqBy(newSoulmates, "name");
    setSoulmates(newSoulmates);
  });

  useEffect(() => {
    ipcRenderer.send("scan", {});
  }, []);

  return { soulmates, soulmate, setSoulmate };
};

export default createContainer(SoulmatesContainer);
