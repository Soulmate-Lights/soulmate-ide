import { createContainer } from "unstated-next";

function Config() {
  const [simulator, setSimulator] = useState(
    "https://editor.soulmatelights.com/sketches/build"
  );
  const [firmware, setFirmware] = useState(
    "https://firmware.soulmatelights.com:8083/build"
  );
  const [appServer, setAppServer] = useState(
    "https://editor.soulmatelights.com/"
  );

  return {
    simulator,
    setSimulator,
    firmware,
    setFirmware,
    appServer,
    setAppServer,
  };
}

export default createContainer(Config);
