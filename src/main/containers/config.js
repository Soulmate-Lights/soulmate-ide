import { createContainer } from "unstated-next";

import isElectron from "~/utils/isElectron";

let host = process.env.SERVER || window.location.origin;
if (isElectron() && !process.env.SERVER)
  host = "https://editor.soulmatelights.com";

export let simulatorBuildUrl =
  "https://editor.soulmatelights.com/sketches/build";
export let fullBuildUrl = `https://firmware.soulmatelights.com:8083/build`;

function Config() {
  const [simulator, setSimulator] = useState(simulatorBuildUrl);
  const [firmware, setFirmware] = useState(fullBuildUrl);
  const [appServer, setAppServer] = useState(host);

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
