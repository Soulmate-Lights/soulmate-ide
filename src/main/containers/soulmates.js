import { useState } from "react";
import { createContainer } from "unstated-next";

import ConfigContainer from "~/containers/config";
import NotificationsContainer from "~/containers/notifications";
import { getFullBuild, prepareSketches } from "~/utils/code";
import { flashBuild } from "~/utils/flash";
import { getPort, readPort } from "~/utils/ports";
import useInterval from "~/utils/useInterval";

const SoulmateContainer = () => {
  const notificationsContainer = NotificationsContainer.useContainer();
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

  const checkUsb = async () => {
    const newPort = await getPort();

    if (newPort && !port) {
      notificationsContainer.notify(`Detecting Soulmate...`);
      setPort(newPort);
      setSoulmateLoading(true);
      const data = await readPort(newPort);
      setSoulmateLoading(false);

      if (data) {
        configContainer.setConfigFromSoulmateData(data);
      }
      setName(data?.name || "USB Soulmate");
    } else if (!newPort) {
      setPort(undefined);
      setName(undefined);
    }
  };

  useEffect(() => {
    if (name) {
      notificationsContainer.notify(`${name} connected!`);
    }
  }, [name]);

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
