import { createContainer } from "unstated-next";
import uniqBy from "lodash/uniqBy";
import { prepareFullCodeWithMultipleSketches } from "./code";
import { getFullBuild } from "./compiler/compile";
import { useState, useEffect } from "react";
import useInterval from "./utils/useInterval";

const childProcess = remote.require("child_process");
const path = remote.require("path");
const fs = remote.require("fs");
import { rootPath } from "electron-root-path";
const IS_PROD = process.env.NODE_ENV === "production";
const root = rootPath;
const { getAppPath } = remote.app;
const isPackaged =
  remote.process.mainModule.filename.indexOf("app.asar") !== -1;

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

  const [usbFlashingPercentage, setUsbFlashingPercentage] = useState(-1);

  const [usbConnected, setUsbConnected] = useState(false);
  let usbInterval;
  useEffect(() => {
    const checkUsb = () => {
      const ports = fs.readdirSync("/dev");
      const port = ports.filter((p) => p.includes("tty.usbserial"))[0];
      setUsbConnected(!!port);
    };
    checkUsb();
    usbInterval = setInterval(checkUsb, 2000);

    return () => {
      clearInterval(usbInterval);
    };
  }, []);

  const flashToUsb = async (
    sketches,
    rows,
    cols,
    chipType,
    ledType,
    milliamps
  ) => {
    const preparedCode = prepareFullCodeWithMultipleSketches(
      sketches,
      rows,
      cols,
      chipType,
      ledType,
      milliamps
    );

    setUsbFlashingPercentage(0);

    const build = await getFullBuild(preparedCode);

    const dir =
      IS_PROD && isPackaged
        ? path.join(path.dirname(getAppPath()), "..", "./builder")
        : path.join(root, "builder");
    const ports = fs.readdirSync("/dev");
    const port = ports.filter((p) => p.includes("tty.usbserial"))[0];

    const cmd = `
    cd "${dir}" &&
    ./pip install pyserial &&
    python ./esptool.py --chip esp32 --port /dev/${port} --baud 1500000 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect 0xe000 ./ota_data_initial.bin 0x1000 ./bootloader.bin 0x10000 ${build} 0x8000 ./partitions.bin`;

    var child = childProcess.exec(cmd);
    child.on("error", console.log);
    child.stderr.on("data", console.log);
    child.stdout.on("data", (data) => {
      const text = data.toString().trim();

      try {
        if (
          text.includes("Writing at 0x0000e000") ||
          text.includes("Writing at 0x00001000")
        ) {
          return;
        } else {
          let number = parseInt(
            data.toString().split("...")[1].split("(")[1].split(" ")[0]
          );
          number = Math.min(number, 100);
          setUsbFlashingPercentage(number);
        }
      } catch (e) {
        // nothing
      }
    });
    child.on("close", () => {
      setUsbFlashingPercentage(-1);
    });
  };

  return {
    soulmates,
    soulmate,
    setSoulmate,
    flashMultiple,
    saveConfig,
    getConfig,
    flashToUsb,
    usbFlashingPercentage,
    usbConnected,
  };
};

const container = createContainer(SoulmatesContainer);

window.soulmatesContainer = container;

export default container;
