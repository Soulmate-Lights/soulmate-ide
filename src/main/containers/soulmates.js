import useInterval from "@use-it/interval";
import takeRight from "lodash/takeRight";
import { useState } from "react";
import { createContainer } from "unstated-next";

import ConfigContainer from "~/containers/config";
import NotificationsContainer from "~/containers/notifications";
import { getFullBuild, prepareSketches } from "~/utils/code";
import { flashBuild } from "~/utils/flash";
import { getPort, PortListener } from "~/utils/ports";

const LINE_LIMIT = 300;

const SoulmateContainer = () => {
  const notificationsContainer = NotificationsContainer.useContainer();
  const configContainer = ConfigContainer.useContainer();
  const [soulmateLoading, setSoulmateLoading] = useState(false);
  const [port, setPort] = useState();
  const [name, setName] = useState();
  const [usbFlashingPercentage, setUsbFlashingPercentage] = useState();
  const [flashing, setFlashing] = useState(false);

  // var listener;
  const [listener, setListener] = useState();
  const [text, setText] = useState([]);

  // Web-safe!
  if (!window.ipcRenderer) return {};

  const getBuild = async (sketches, config) => {
    const preparedCode = prepareSketches(sketches, config);
    console.log("[flashSketches]", { preparedCode });
    const build = await getFullBuild(preparedCode);

    return build;
  };

  const flashSketches = async (sketches, config) => {
    console.log("[flashSketches]", { sketches, config });

    listener?.close();
    setFlashing(true);

    const build = await getBuild(sketches, config);
    if (!build) {
      setFlashing(false);
      return false;
    }

    console.log("[flashSketches]", { build, port });

    await flashBuild(port, build, (progress) => {
      setUsbFlashingPercentage(progress);
      setFlashing(progress < 100);
    });

    setUsbFlashingPercentage(undefined);
    setFlashing(false);
    open(port);
    return true;
  };

  const open = (port) => {
    let receivedData;

    const listener = new PortListener(port, (text) => {
      if (text[0] === "{") {
        setSoulmateLoading(false);
        const data = JSON.parse(text);
        receivedData = data;
        configContainer.setConfigFromSoulmateData(data);
        setName(data?.name || "USB Soulmate");
      }
      setText((oldText) => [...takeRight(oldText, LINE_LIMIT), text]);
    });

    setListener(listener);

    setTimeout(() => {
      if (!receivedData) {
        setSoulmateLoading(false);
        setName("USB Soulmate");
      }
    }, 2000);

    window.addEventListener("beforeunload", () => {
      listener?.close();
    });
  };

  const checkUsb = async () => {
    if (flashing) return;

    const newPort = await getPort();

    if (newPort && !port) {
      notificationsContainer.notify(`Detecting Soulmate...`);
      setPort(newPort);
      setSoulmateLoading(true);

      open(newPort);
    } else if (!newPort) {
      listener?.close();
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

  const restart = () => {
    listener.port.write('{ "restart": true }\n');
  };

  return {
    getBuild,
    flashSketches,
    soulmateLoading,
    port,
    name,
    usbFlashingPercentage,
    flashing,
    text,
    restart,
  };
};

const container = createContainer(SoulmateContainer);
export default container;
