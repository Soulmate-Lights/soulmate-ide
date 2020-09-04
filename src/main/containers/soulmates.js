import { useEffect, useState } from "react";
import ConfigContainer from "~/containers/config";
import { flashBuildtoUSBSoulmate } from "~/utils/build";
import { configs } from "~/utils/config";
import { createContainer } from "unstated-next";
import { getFullBuild } from "~/utils/compiler/compile";
import { prepareFullCodeWithMultipleSketches } from "~/utils/code";
import uniqBy from "lodash/uniqBy";
import useInterval from "~/utils/useInterval";
import { readPort, getPort } from "~/utils/ports";

const defaultConfig = configs.Square;

const SoulmatesContainer = () => {
  const [usbSoulmate, setUsbSoulmate] = useState();
  const [soulmates, setSoulmates] = useState([]);
  const [soulmate, setSoulmate] = useState(undefined);
  const [configs, setConfigs] = useState({});

  // Web-safe!
  if (!window.ipcRenderer) {
    return { soulmates, soulmate, getSelectedSoulmate: () => {} };
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

  const compareSoulmates = (s1, s2) => {
    if (s1.type === "usb" && s1.type === s2.type) return true;
    return s1.addresses && s2.addresses && s1.addresses[0] === s2.addresses[0];
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
    const preparedCode = prepareFullCodeWithMultipleSketches(sketches, config);
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
    updateSoulmate(soulmate, { usbFlashingPercentage: 1, flashing: true });

    await flashBuildtoUSBSoulmate(soulmate.port, build, (progress) => {
      if (progress < 100) {
        updateSoulmate(soulmate, {
          usbFlashingPercentage: progress,
          flashing: true,
        });
      } else {
        updateSoulmate(soulmate, {
          usbFlashingPercentage: undefined,
          flashing: false,
        });
      }
    });
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
  const [soulmateLoading, setSoulmateLoading] = useState(false);

  const configContainer = ConfigContainer.useContainer();

  const checkUsb = async () => {
    const port = await getPort();

    if (port && !usbConnected) {
      setSoulmateLoading(true);
      readPort(port).then((data) => {
        setSoulmateLoading(false);

        if (data) {
          configContainer.setType("custom");
          configContainer.setConfig({
            rows: data.rows,
            cols: data.cols,
            button: data.button,
            clock: data.clock,
            data: data.data,
            ledType: data.ledType,
            serpentine: data.serpentine,
            milliamps: data.milliamps,
          });
        }
      });

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
    soulmateLoading,
    usbConnected,
    usbSoulmate,
  };
};

const container = createContainer(SoulmatesContainer);
export default container;
