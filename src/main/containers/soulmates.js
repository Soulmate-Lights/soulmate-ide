import useInterval from "@use-it/interval";
import map from "lodash/map";
import takeRight from "lodash/takeRight";
import uniqBy from "lodash/uniqBy";
import { useState } from "react";
import { createContainer } from "unstated-next";

import NotificationsContainer from "~/containers/notifications";
import { getFullBuild, prepareSketches } from "~/utils/code";
import { flashBuild } from "~/utils/flash";
import isElectron from "~/utils/isElectron";
import { getPort, getPorts, PortListener } from "~/utils/ports";

import { flashbuildToWifiSoulmate } from "../utils/flash";

if (typeof window.ipcRenderer === "undefined" || !window.ipcRenderer)
  window.ipcRenderer = undefined;

const LINE_LIMIT = 300;

export const defaultConfig = {
  rows: 10,
  cols: 10,
  serpentine: true,
};

// TODO:
// 1. Change list of soulmates exported to [usbSoulmate, wifiSoulmate, wifiSoulmate]
// 2. Make it so you can stream to Soulmates even when USB's connected

const SoulmatesContainer = () => {
  const notificationsContainer = NotificationsContainer.useContainer();
  const [soulmateLoading, setSoulmateLoading] = useState(false);

  const [ports, setPorts] = useState([]);
  const [port, setPort] = useState();
  const usbConnected = !!port;

  // This one's only used for USB soulmates right now
  const [usbFlashingPercentage, setUsbFlashingPercentage] = useState();

  // Wifi and USB soulmates
  const [flashing, setFlashing] = useState(false);

  const [listener, setListener] = useState();
  const [text, setText] = useState([]);
  // const [config, setConfig] = useState(defaultConfig);
  const [error, setError] = useState(false);

  // const setConfigFromSoulmateData = (data) => {
  //   setConfig({
  //     name: data.name,
  //     rows: data.rows,
  //     cols: data.cols,
  //     button: data.button,
  //     clock: data.clock,
  //     data: data.data,
  //     ledType: data.ledType,
  //     serpentine: data.serpentine,
  //     milliamps: data.milliamps,
  //   });
  // };

  // Wifi Soulmates
  // TODO: Save the soulmate configs here somewhere - maybe in the soulmate objects themselves.
  // Do we need a Soulmate class?!
  const [soulmates, setSoulmates] = useState([]);
  const [selectedSoulmate, setSelectedSoulmate] = useState(undefined);
  const usbSoulmate = soulmates.find((s) => s.type === "usb");
  const needsSetup = !!port && !usbSoulmate?.config;
  const config = selectedSoulmate?.config || defaultConfig;

  useEffect(() => {
    if (!selectedSoulmate && usbSoulmate) {
      setSelectedSoulmate(usbSoulmate);
      //     // setConfig(defaultConfig);
      //   } else if (selectedSoulmate) {
      //     setConfigFromSoulmateData(selectedSoulmate.config);
      //   } else {
      //     setPort(false);
      //     checkUsb();
    }
  }, [selectedSoulmate]);

  const addSoulmate = (_event, soulmate) => {
    const addresses = map(soulmates, "addresses[0]");
    if (addresses.includes(soulmate.addresses[0])) {
      return;
    }

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
    ipcRenderer?.on("soulmate", addSoulmate);
    return () => ipcRenderer?.removeListener("soulmate", addSoulmate);
  }, [soulmates]);

  useEffect(() => {
    ipcRenderer?.send("scan", {});
    setTimeout(() => {
      ipcRenderer?.send("scan", {});
    }, 1000);
  }, []);

  useInterval(() => {
    ipcRenderer?.send("scan", {});
  }, 5000);

  const flashSketches = async (sketches, config) => {
    setFlashing(true);

    let build;
    try {
      const preparedCode = prepareSketches(sketches, config);
      build = await getFullBuild(preparedCode);
    } catch (e) {
      setError(e);
      setFlashing(false);
      throw e;
    }

    if (!build) {
      setFlashing(false);
      return false;
    }

    listener?.close();

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
      try {
        await flashBuild(port, build, (progress) => {
          setUsbFlashingPercentage(progress);
          setFlashing(progress < 100);
        }).catch((e) => {
          setError(e);
        });
      } catch (e) {
        setError(e);
        throw e;
      }
    }

    setUsbFlashingPercentage(undefined);
    setFlashing(false);
    if (port) openPort(port);
    return true;
  };

  // USB Soulmate stuff

  const openPort = (port) => {
    if (!isElectron()) return;

    setSelectedSoulmate(undefined);
    let receivedData;

    const listener = new PortListener(port, (text) => {
      if (text[0] === "{") {
        const config = JSON.parse(text);
        receivedData = config;
        const newSoulmate = {
          config,
          type: "usb",
          port,
        };
        setSoulmates([...soulmates, newSoulmate]);
        setSelectedSoulmate(newSoulmate);
        setSoulmateLoading(false);
        notificationsContainer.notify(
          `${config?.name || "USB Soulmate"} connected!`
        );
      }
      setText((oldText) => [...takeRight(oldText, LINE_LIMIT), text]);
    });

    setListener(listener);

    setTimeout(() => {
      if (!receivedData) {
        setSoulmateLoading(false);
      }
    }, 2000);

    window.addEventListener("beforeunload", () => {
      listener?.close();
    });
  };

  // Reading from USB soulmate
  const previousPort = useRef();
  useEffect(() => {
    if (!isElectron()) return;

    if (!port || port !== previousPort.current) {
      if (previousPort.current && !port) {
        notificationsContainer.notify(`Soulmate disconnected.`);
      }

      // setConfig(defaultConfig);
      setSoulmates(soulmates.filter((s) => s.port !== previousPort.current));

      previousPort.current = undefined;
      listener?.close();
      setText([]);
    }

    if (port && port !== previousPort.current) {
      previousPort.current = port;
      notificationsContainer.notify(`Detecting Soulmate...`);
      setSoulmateLoading(true);
      openPort(port);
      setText([`Connected to ${port}`]);
    }
  }, [port]);

  const checkUsb = async () => {
    if (flashing) return;
    if (!isElectron()) return;

    const newPort = await getPort();
    const newPorts = await getPorts();

    setPorts(newPorts);

    if (newPort && !port) {
      setPort(newPort);
    } else if (!newPort) {
      setPort(undefined);
    }
  };

  useInterval(checkUsb, 5000);
  useEffect(() => {
    checkUsb(); // This has to be on its own line so it doesn't return and break the hook
  }, []);

  const restart = () => {
    listener?.port?.write('{ "restart": true }\n');
  };

  return {
    flashSketches,
    soulmateLoading,
    usbConnected,
    config,
    port,
    setPort,
    ports,
    usbFlashingPercentage,
    flashing,
    text,
    restart,
    soulmates,
    selectedSoulmate,
    setSelectedSoulmate,
    needsSetup,
    error,
    setError,
  };
};

export default createContainer(SoulmatesContainer);
