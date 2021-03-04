import useInterval from "@use-it/interval";
import map from "lodash/map";
import takeRight from "lodash/takeRight";
import uniqBy from "lodash/uniqBy";
import { useState } from "react";
import { createContainer } from "unstated-next";

import NetworkContainer from "~/containers/network";
import NotificationsContainer from "~/containers/notifications";
import { getFullBuild, prepareSketches } from "~/utils/code";
import { flashBuild } from "~/utils/flash";
import isElectron from "~/utils/isElectron";
import { getPort, getPorts, PortListener } from "~/utils/ports";
import soulmateName from "~/utils/soulmateName";

const saveBuild = (sketches, config, id) => {
  fetch("https://editor.soulmatelights.com/builds", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ sketches, config, id }),
  });
};

import { flashbuildToWifiSoulmate } from "../utils/flash";

if (typeof window.ipcRenderer === "undefined" || !window.ipcRenderer)
  window.ipcRenderer = undefined;

const LINE_LIMIT = 300;

const saveConfig = ({ rows, cols }) =>
  (localStorage["simulatorConfig"] = JSON.stringify({ rows, cols }));

const readConfig = () => {
  if (localStorage["simulatorConfig"]) {
    return JSON.parse(localStorage["simulatorConfig"]);
  } else {
    return {};
  }
};

export const defaultConfig = {
  rows: 20,
  cols: 20,
  serpentine: true,
  button: 39,
  data: 32,
  clock: 26,
  milliamps: 700,
  ledType: "apa102",
};

// TODO:
// 1. Change list of soulmates exported to [usbSoulmate, wifiSoulmate, wifiSoulmate]
// 2. Make it so you can stream to Soulmates even when USB's connected

const SoulmatesContainer = () => {
  const notificationsContainer = NotificationsContainer.useContainer();
  const { firmware } = NetworkContainer.useContainer();
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

  const [savedConfig, _setSavedConfig] = useState({
    ...defaultConfig,
    ...readConfig(),
  });
  const config = selectedSoulmate?.config || savedConfig;

  const setSavedConfig = (config) => {
    saveConfig(config);
    _setSavedConfig(config);
  };

  useEffect(() => {
    if (!selectedSoulmate && usbSoulmate) {
      setSelectedSoulmate(usbSoulmate);
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
      const id = Math.random().toString(36).substring(2, 8);
      saveBuild(sketches, config, id);
      const preparedCode = prepareSketches(sketches, config, id);
      build = await getFullBuild(preparedCode, firmware);
    } catch (e) {
      console.log("[flashSketches] Error getting full build", e);
      setError(e);
      setFlashing(false);
      throw e;
    }

    if (!build) {
      setFlashing(false);
      return false;
    }

    listener?.close();

    if (selectedSoulmate?.type === "http") {
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
        console.log(`[flashSketches] Flashing to ${port}...`);
        await flashBuild(port, build, (progress) => {
          setUsbFlashingPercentage(progress);
          setFlashing(progress < 100);
        }).catch((e) => {
          console.log(`[flashSketches] Error flashing to ${port}`, e);
          setError(e);
        });
      } catch (e) {
        console.log(`[flashSketches] Wrapped error flashing ${port}`, e);
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
    setSoulmates(soulmates.filter((soulmate) => soulmate.type !== "usb"));

    let newSoulmate = { type: "usb", port, config: null };
    setSoulmates([...soulmates, newSoulmate]);
    setSelectedSoulmate(newSoulmate);

    let receivedData;
    const listener = new PortListener(port, (text) => {
      if (text[0] === "{") {
        try {
          const config = JSON.parse(text);
          receivedData = config;
          const newSoulmate = {
            config,
            type: "usb",
            port,
          };
          const filteredSoulmates = soulmates.filter(
            (soulmate) => soulmate.port !== port
          );
          setSoulmates([...filteredSoulmates, newSoulmate]);
          setSelectedSoulmate(newSoulmate);
          setSoulmateLoading(false);
          notificationsContainer.notify(
            `${soulmateName(newSoulmate)} connected!`
          );
        } catch (e) {
          console.log("Error parsing", e, text);
        }
      }
      setText((oldText) => [...takeRight(oldText, LINE_LIMIT), text]);
    });

    setListener(listener);

    listener?.port?.write('{ "status": true }\n');

    setTimeout(() => {
      if (!receivedData) setSoulmateLoading(false);
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

      setSoulmates(soulmates.filter((s) => s.port !== previousPort.current));
      setSelectedSoulmate(undefined);

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
    setSavedConfig,
  };
};

export default createContainer(SoulmatesContainer);
