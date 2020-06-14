import { createContainer } from "unstated-next";
import uniqBy from "lodash/uniqBy";
import { prepareFullCodeWithMultipleSketches } from "./code";
import { getFullBuild } from "./compiler/compile";
import { useState, useEffect } from "react";
import useInterval from "./utils/useInterval";

const defaultConfig = {
  rows: 70,
  cols: 15,
  chipType: "atom",
  ledType: "APA102",
  milliamps: 700,
};

const SoulmatesContainer = () => {
  const [soulmates, setSoulmates] = useState([]);
  const [soulmate, setSoulmate] = useState(undefined);
  const [configs, setConfigs] = useState({});

  // Web-safe!
  if (!window.ipcRenderer) {
    return { soulmates, soulmate };
  }

  const addSoulmate = (_event, soulmate) => {
    let newSoulmates = [...soulmates, soulmate];
    newSoulmates = uniqBy(newSoulmates, "addresses[0]");
    setSoulmates(newSoulmates);

    if (localStorage[soulmate.name]) {
      const config = JSON.parse(localStorage[soulmate.name]);
      const key = soulmate.name;
      setConfigs({ ...configs, [key]: config });
    }
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

  const flashMultiple = async (
    soulmate,
    sketches,
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
    setSoulmate(updatedSoulmate);
    setSoulmates(soulmates);

    const preparedCode = prepareFullCodeWithMultipleSketches(
      sketches,
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

  const saveConfig = (soulmate, config) => {
    if (!soulmate) return;
    localStorage[soulmate.name] = JSON.stringify(config);
    const key = soulmate.name;
    setConfigs({ ...configs, [key]: config });
  };

  const getConfig = (soulmate) => {
    const key = soulmate?.name;
    return configs[key] || defaultConfig;
  };

  return {
    soulmates,
    soulmate,
    setSoulmate,
    flashMultiple,
    saveConfig,
    getConfig,
  };
};

export default createContainer(SoulmatesContainer);
