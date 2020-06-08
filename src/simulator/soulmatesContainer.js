import { createContainer } from "unstated-next";
import uniqBy from "lodash/uniqBy";
import { prepareFullCode } from "./code";
import { getFullBuild } from "./compiler/compile";
import { useState, useEffect } from "react";
import useInterval from "./utils/useInterval";

const SoulmatesContainer = () => {
  const [soulmates, setSoulmates] = useState([]);
  const [soulmate, setSoulmate] = useState(undefined);

  const addSoulmate = (_event, soulmate) => {
    let newSoulmates = [...soulmates, soulmate];
    newSoulmates = uniqBy(newSoulmates, "addresses[0]");
    setSoulmates(newSoulmates);
  };

  useEffect(() => {
    ipcRenderer.on("soulmate", addSoulmate);
    return () => ipcRenderer.removeListener("soulmate", addSoulmate);
  }, [soulmates]);

  useEffect(() => {
    ipcRenderer.send("scan", {});
    setTimeout(() => {
      ipcRenderer.send("scan", {});
    }, 1000);
  }, []);

  useInterval(() => {
    ipcRenderer.send("scan", {});
  }, 5000);

  const flash = async (
    soulmate,
    name,
    code,
    rows,
    cols,
    chipType,
    ledType,
    milliamps
  ) => {
    let soulmateIndex = soulmates.findIndex(
      (s) => s.addresses[0] === soulmate.addresses[0]
    );
    let updatedSoulmate = { ...soulmates[soulmateIndex], flashing: true };
    soulmates[soulmateIndex] = updatedSoulmate;
    setSoulmate(updatedSoulmate);
    setSoulmates(soulmates);

    const preparedCode = prepareFullCode(
      name,
      code,
      rows,
      cols,
      chipType,
      ledType,
      milliamps
    );

    const build = await getFullBuild(preparedCode);

    const ip = soulmate.addresses[0];
    const url = `http://${ip}/ota`;

    var body = new FormData();
    const contents = fs.readFileSync(build);
    body.append("image", new Blob([contents]), "firmware.bin");
    await fetch(url, {
      method: "POST",
      body: body,
      mode: "no-cors",
      headers: {
        "Content-Length": fs.statSync(build).size,
      },
    });

    soulmateIndex = soulmates.findIndex(
      (s) => s.addresses[0] === soulmate.addresses[0]
    );
    updatedSoulmate = { ...soulmates[soulmateIndex], flashing: false };
    soulmates[soulmateIndex] = updatedSoulmate;
    setSoulmate(updatedSoulmate);
    setSoulmates(soulmates);
  };

  return { soulmates, soulmate, setSoulmate, flash };
};

export default createContainer(SoulmatesContainer);
