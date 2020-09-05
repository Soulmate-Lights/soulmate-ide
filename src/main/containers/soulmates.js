import { useState } from "react";
import { createContainer } from "unstated-next";

import ConfigContainer from "~/containers/config";
import { getFullBuild, prepareSketches } from "~/utils/code";
import { flashBuild } from "~/utils/flash";
import { getPort, readPort } from "~/utils/ports";
import useInterval from "~/utils/useInterval";

const SoulmateContainer = () => {
  const configContainer = ConfigContainer.useContainer();
  const [soulmateLoading, setSoulmateLoading] = useState(false);
  const [port, setPort] = useState();
  const [name, setName] = useState();
  const [usbFlashingPercentage, setUsbFlashingPercentage] = useState();
  const [flashing, setFlashing] = useState(false);

  // Web-safe!
  if (!window.ipcRenderer) return {};

  const flashSketches = async (sketches, config) => {
    setFlashing(true);

    const preparedCode = prepareSketches(sketches, config);
    const build = await getFullBuild(preparedCode);

    if (!build) {
      setFlashing(false);
      return false;
    }

    await flashBuild(port, build, (progress) => {
      setUsbFlashingPercentage(progress);
      setFlashing(progress < 100);
    });

    setUsbFlashingPercentage(undefined);
    setFlashing(false);
    return true;
  };

  // Config stuff

  const checkUsb = async () => {
    const newPort = await getPort();

    if (newPort && !port) {
      setPort(newPort);
      setSoulmateLoading(true);
      readPort(newPort).then((data) => {
        setSoulmateLoading(false);

        if (data) {
          console.log(data);
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

        console.log(data);
        setName(data.name || "USB Soulmate");
      });
    } else if (!newPort) {
      setPort(undefined);
    }
  };

  useInterval(checkUsb, 2000);
  useEffect(() => checkUsb(), []);

  return {
    flashSketches,
    soulmateLoading,
    port,
    name,
    usbFlashingPercentage,
    flashing,
  };
};

const container = createContainer(SoulmateContainer);
export default container;
