import { useEffect, useState } from "react";

import { configs } from "~/utils/config";
import { createContainer } from "unstated-next";
import { getFullBuild } from "~/utils/compiler/compile";
import { prepareFullCodeWithMultipleSketches } from "~/utils/code";
import uniqBy from "lodash/uniqBy";
import useInterval from "~/utils/useInterval";

const defaultConfig = configs.Square;

const getPort = async () => {
  const serialport = remote.require("serialport");
  const results = await serialport.list();
  const port = results.find((result) => result.vendorId === "0403");
  return port.comName;
};

const path = remote.require("path");
const fs = remote.require("fs");
const IS_PROD = process.env.NODE_ENV === "production";
const { getAppPath } = remote.app;
const isPackaged =
  remote.process.mainModule.filename.indexOf("app.asar") !== -1;
const rootPath = remote.require("electron-root-path").rootPath;

const getDir = () => {
  return IS_PROD && isPackaged
          ? path.join(path.dirname(getAppPath()), "..", "./builder")
          : path.join(rootPath, "builder");
}

const installDependencies = () => {
  const childProcess = remote.require("child_process");
  if (remote.require("os").platform() === "darwin") {
    // Ensure pyserial is installed before flashing
    if (!fs.existsSync(`/usr/local/bin/pip`)) {
      childProcess.execSync("python ./get-pip.py", { cwd: dir });
    }
    childProcess.execSync(`/usr/local/bin/pip" install pyserial`);
  }
}

const SoulmatesContainer = () => {
  const [usbSoulmate, setUsbSoulmate] = useState();
  const [soulmates, setSoulmates] = useState([]);
  const [soulmate, setSoulmate] = useState(undefined);
  const [configs, setConfigs] = useState({});

  // Web-safe!
  if (!window.ipcRenderer) {
    return { soulmates, soulmate, getSelectedSoulmate: () => {} };
  }

  const childProcess = remote.require("child_process");

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
    setUsbSoulmate(soulmates?.find((s) => s.type === "usb"));
  };

  const flashMultiple = async (soulmate, sketches, config) => {
    updateSoulmate(soulmate, { flashing: true });
    console.log(config);
    const preparedCode = prepareFullCodeWithMultipleSketches(sketches, config);
    console.log(preparedCode);
    const build = await getFullBuild(preparedCode);

    if (!build) {
      updateSoulmate(soulmate, { flashing: false });
      return false;
    }

    await sendBuildToSoulmate(build, soulmate);
    updateSoulmate(soulmate, { flashing: false });
    return true;
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
      installDependencies();
      updateSoulmate(soulmate, { usbFlashingPercentage: 0 });
      const dir = getDir();
      const port = await getPort();
      const cmd = `python ./esptool.py --chip esp32 --port ${port} --baud 1500000 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect 0xe000 ./ota_data_initial.bin 0x1000 ./bootloader.bin 0x10000 ${build} 0x8000 ./partitions.bin`;

      console.log(`Port: ${port}`);
      console.log(`Build: ${build}`);
      console.log(`Command: ${cmd}`);

      var child = childProcess.exec(cmd, { cwd: dir });

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
          console.log("done");
          updateSoulmate(soulmate, {
            usbFlashingPercentage: undefined,
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

  const checkUsb = async () => {
    const port = await getPort();

    if (port && !usbConnected) {
      const usbSoulmate = { port, type: "usb", name: "USB Soulmate" };
      setSoulmates([...soulmates, usbSoulmate]);
      setUsbSoulmate(usbSoulmate);
    } else if (!port) {
      setSoulmates(soulmates.filter((soulmate) => soulmate.type !== "usb"));
      setUsbSoulmate(undefined);
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
    usbSoulmate,
  };
};

const container = createContainer(SoulmatesContainer);

window.soulmatesContainer = container;

export default container;
