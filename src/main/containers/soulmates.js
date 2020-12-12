import useInterval from "@use-it/interval";
import takeRight from "lodash/takeRight";
import uniqBy from "lodash/uniqBy";
import { useState } from "react";
import { createContainer } from "unstated-next";

import ConfigContainer from "~/containers/config";
import NotificationsContainer from "~/containers/notifications";
import { getFullBuild, prepareSketches } from "~/utils/code";
import { flashBuild } from "~/utils/flash";
import { getPort, getPorts, PortListener } from "~/utils/ports";

import { flashbuildToWifiSoulmate } from "../utils/flash";

const LINE_LIMIT = 300;

const SoulmateContainer = () => {
  const notificationsContainer = NotificationsContainer.useContainer();
  const configContainer = ConfigContainer.useContainer();
  const [soulmateLoading, setSoulmateLoading] = useState(false);

  const [ports, setPorts] = useState([]);
  const [port, setPort] = useState();
  const usbConnected = !!port;

  // This one's only used for USB soulmates right now
  const [name, setName] = useState();
  const [usbFlashingPercentage, setUsbFlashingPercentage] = useState();

  // Wifi and USB soulmates
  const [flashing, setFlashing] = useState(false);

  // var listener;
  const [listener, setListener] = useState();
  const [text, setText] = useState([]);

  // Wifi Soulmates
  // TODO: Save the soulmate configs here somewhere - maybe in the soulmate objects themselves.
  // Do we need a Soulmate class?!
  const [soulmates, setSoulmates] = useState([]);
  const [selectedSoulmate, setSelectedSoulmate] = useState(undefined);

  const addSoulmate = (_event, soulmate) => {
    const socket = new WebSocket(`ws://${soulmate.addresses[0]}:81`);
    socket.onopen = () => {
      socket.onmessage = (e) => {
        // const { version, rows, cols, serpentine } = JSON.parse(e.data);
        soulmate.config = JSON.parse(e.data);
        socket.close();
      };
      socket.send(JSON.stringify({ whatup: true }));
    };

    let newSoulmates = [...soulmates, soulmate];
    newSoulmates = uniqBy(newSoulmates, "addresses[0]");
    setSoulmates(newSoulmates);
  };

  useEffect(() => {
    if (!selectedSoulmate) return;
    setName(selectedSoulmate?.name);
    configContainer.setConfigFromSoulmateData(selectedSoulmate.config);
  }, [selectedSoulmate]);

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

  // Web-safe!
  if (!window.ipcRenderer) return {};

  const getBuild = async (sketches, config) => {
    const preparedCode = prepareSketches(sketches, config);
    const build = await getFullBuild(preparedCode);

    return build;
  };

  const flashSketches = async (sketches, config) => {
    listener?.close();
    setFlashing(true);

    const build = await getBuild(sketches, config);
    if (!build) {
      setFlashing(false);
      return false;
    }

    if (selectedSoulmate) {
      await flashbuildToWifiSoulmate(
        selectedSoulmate.addresses[0],
        build,
        (progress) => {
          setUsbFlashingPercentage(progress);
          setFlashing(progress < 100);
        }
      );
    } else {
      await flashBuild(port, build, (progress) => {
        setUsbFlashingPercentage(progress);
        setFlashing(progress < 100);
      });
    }

    setUsbFlashingPercentage(undefined);
    setFlashing(false);
    open(port);
    return true;
  };

  // Port stuff

  const open = (port) => {
    let receivedData;

    const listener = new PortListener(port, (text) => {
      if (text[0] === "{") {
        setSoulmateLoading(false);
        const data = JSON.parse(text);
        receivedData = data;
        configContainer.setConfigFromSoulmateData(data);
        setName(data?.name || "No Name");
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

  const previousPort = useRef();
  useEffect(() => {
    if (!port || port !== previousPort.current) {
      if (previousPort.current && !port) {
        notificationsContainer.notify(`Soulmate disconnected.`);
      }

      previousPort.current = undefined;
      listener?.close();
      setName(undefined);
      setText([]);
    }

    if (port) {
      previousPort.current = port;
      notificationsContainer.notify(`Detecting Soulmate...`);
      setSoulmateLoading(true);
      open(port);
      setText([`Connected to ${port}`]);
    }
  }, [port]);

  const checkUsb = async () => {
    if (flashing) return;

    const newPort = await getPort();
    const newPorts = await getPorts();

    setPorts(newPorts);

    if (newPort && !port) {
      setPort(newPort);
    } else if (!newPort) {
      setPort(undefined);
    }
  };

  useEffect(() => {
    if (name) {
      notificationsContainer.notify(`${name} connected!`);
    }
  }, [name]);

  useInterval(checkUsb, 5000);
  useEffect(() => {
    // This has to be on its own line so it doesn't return and break the hook
    checkUsb();
  }, []);

  const restart = () => {
    listener?.port?.write('{ "restart": true }\n');
  };

  return {
    getBuild,
    flashSketches,
    soulmateLoading,
    usbConnected,
    port,
    setPort,
    ports,
    name,
    usbFlashingPercentage,
    flashing,
    text,
    restart,
    soulmates,
    selectedSoulmate,
    setSelectedSoulmate,
  };
};

const container = createContainer(SoulmateContainer);
export default container;
