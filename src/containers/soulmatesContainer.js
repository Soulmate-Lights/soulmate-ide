import { useEffect, useState } from "react";

import { configs } from "~/utils/config";
import { createContainer } from "unstated-next";
import { getFullBuild } from "~/utils/compiler/compile";
import { prepareFullCodeWithMultipleSketches } from "~/utils/code";
import { rootPath } from "electron-root-path";
import uniqBy from "lodash/uniqBy";
import useInterval from "~/utils/useInterval";

const defaultConfig = configs.Square;

const SoulmatesContainer = () => {
  const [soulmates, setSoulmates] = useState([]);
  const [soulmate, setSoulmate] = useState(undefined);
  const [configs, setConfigs] = useState({});

  // Web-safe!
  if (!window.ipcRenderer) {
    return { soulmates, soulmate, getSelectedSoulmate: () => {} };
  }

  const childProcess = remote.require("child_process");
  const path = remote.require("path");
  const fs = remote.require("fs");
  const IS_PROD = process.env.NODE_ENV === "production";
  const root = rootPath;
  const { getAppPath } = remote.app;
  const isPackaged =
    remote.process.mainModule.filename.indexOf("app.asar") !== -1;

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

  const compareSoulmates = (s1, s2) => {
    if (s1.type === "usb" && s1.type === s2.type) return true;

    if (s1.addresses && s2.addresses) {
      if (s1.addresses[0] === s2.addresses[0]) {
        return true;
      }
    }

    return false;
  };

  const updateSoulmate = (soulmate, attributes) => {
    let soulmateIndex = soulmates.findIndex((s) =>
      compareSoulmates(s, soulmate)
    );
    let updatedSoulmate = { ...soulmates[soulmateIndex], ...attributes };
    soulmates.splice(soulmateIndex, 1, updatedSoulmate);
    setSoulmates(soulmates);
  };

  const flashMultiple = async (
    soulmate,
    sketches,
    rows,
    cols,
    chipType,
    ledType,
    milliamps
  ) => {
    updateSoulmate(soulmate, { flashing: true });
    const preparedCode = prepareFullCodeWithMultipleSketches(
      sketches,
      rows,
      cols,
      chipType,
      ledType,
      milliamps
    );
    const build = await getFullBuild(preparedCode);
    await sendBuildToSoulmate(build, soulmate);
    updateSoulmate(soulmate, { flashing: false });
  };

  // Send to USB or Wifi soulmate
  const sendBuildToSoulmate = async (build, soulmate) => {
    if (soulmate.addresses) {
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
    } else {
      updateSoulmate(soulmate, { usbFlashingPercentage: 0 });
      const dir =
        IS_PROD && isPackaged
          ? path.join(path.dirname(getAppPath()), "..", "./builder")
          : path.join(root, "builder");
      const ports = fs.readdirSync("/dev");
      const port = ports.filter((p) => p.includes("tty.usbserial"))[0];
      const home = remote.require("os").homedir();

      if (!fs.existsSync(`${home}/Library/Python/2.7/bin/pip`)) {
        childProcess.execSync(`cd "${dir}" && python ./get-pip.py`);
      }

      childProcess.execSync(
        `"${home}/Library/Python/2.7/bin/pip" install pyserial`
      );

      const cmd = `
    cd "${dir}" &&
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
            updateSoulmate(soulmate, {
              flashing: true,
              usbFlashingPercentage: number,
            });
          }
        } catch (e) {
          // nothing
        }
      });

      await new Promise((resolve, _reject) => {
        child.on("close", () => {
          updateSoulmate(soulmate, {
            usbFlashingPercentage: -1,
            flashing: false,
          });
          resolve();
        });
      });
    }
  };

  // Config stuff

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

  // Should probably put this on the soulmate itself
  // Don't think we need this any more.
  // We should check ports against soulmates
  const [usbConnected, setUsbConnected] = useState(false);

  const checkUsb = () => {
    const ports = fs.readdirSync("/dev");
    const port = ports.filter(
      (p) => p.includes("tty.usbserial") || p.includes("cu.SLAB_USBtoUART")
    )[0];

    if (port && !usbConnected) {
      const usbSoulmate = { port, type: "usb", name: "USB Soulmate" };
      setSoulmates([...soulmates, usbSoulmate]);
    } else if (!port) {
      setSoulmates(soulmates.filter((soulmate) => soulmate.type !== "usb"));
    }

    setUsbConnected(!!port);
  };

  useInterval(checkUsb, 2000);

  const getSelectedSoulmate = () => {
    if (!soulmate) return undefined;
    return soulmates.find((s) => compareSoulmates(s, soulmate));
  };

  return {
    soulmates,
    soulmate,
    setSoulmate,
    flashMultiple,
    saveConfig,
    getConfig,
    getSelectedSoulmate,
    usbConnected,
  };
};

const container = createContainer(SoulmatesContainer);

window.soulmatesContainer = container;

export default container;
