import { useState } from "react";
import { createContainer } from "unstated-next";

import ConfigContainer from "~/containers/config";
import { getFullBuild, prepareSketches } from "~/utils/code";
import { configs } from "~/utils/config";
import { flashBuildtoUSBSoulmate } from "~/utils/flash";
import { getPort, readPort } from "~/utils/ports";
import useInterval from "~/utils/useInterval";

const defaultConfig = configs.Square;

const SoulmatesContainer = () => {
  const configContainer = ConfigContainer.useContainer();
  const [usbSoulmate, setUsbSoulmate] = useState();
  const [configs, setConfigs] = useState({});
  const [usbConnected, setUsbConnected] = useState(false);
  const [soulmateLoading, setSoulmateLoading] = useState(false);

  // Web-safe!
  if (!window.ipcRenderer) {
    return { usbSoulmate, getSelectedSoulmate: () => {} };
  }

  const updateSoulmate = (attributes) => {
    setUsbSoulmate({ ...usbSoulmate, attributes });
  };

  const flashSketches = async (sketches, config) => {
    updateSoulmate({ flashing: true });

    const preparedCode = prepareSketches(sketches, config);
    const build = await getFullBuild(preparedCode);

    if (!build) {
      updateSoulmate({ flashing: false });
      return false;
    }

    await flashBuildtoUSBSoulmate(usbSoulmate.port, build, (progress) => {
      updateSoulmate({
        usbFlashingPercentage: progress,
        flashing: progress < 100,
      });
    });

    updateSoulmate(usbSoulmate, {
      usbFlashingPercentage: undefined,
      flashing: false,
    });
    return true;
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

        const usbSoulmate = { port, name: data.name || "USB Soulmate" };
        setUsbSoulmate(usbSoulmate);
      });
    } else if (!port) {
      setUsbSoulmate(undefined);
    }

    setUsbConnected(!!port);
  };

  useInterval(checkUsb, 2000);

  return {
    flashSketches,
    saveConfig,
    getConfig,
    soulmateLoading,
    usbConnected,
    usbSoulmate,
  };
};

const container = createContainer(SoulmatesContainer);
export default container;
