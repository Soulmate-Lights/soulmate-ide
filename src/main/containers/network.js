import normalizeUrl from "normalize-url";

import { auth0Promise } from "~/utils/auth";
import { headersAndCredentials } from "~/utils/network";
import { createContainer } from "~/utils/unstated-next";

// Legacy URLs
if (localStorage.appServerUrl === "https://editor.soulmatelights.com/")
  localStorage.appServerUrl = "https://server.soulmatelights.com/";

if (localStorage.simulatorUrl == "https://editor.soulmatelights.com/sketches/build")
  localStorage.simulatorUrl = "https://firmware.soulmatelights.com:8082/build"

let initialSimulatorUrl =
  localStorage.simulatorUrl || "https://firmware.soulmatelights.com:8082/build";

let initialFirmwareUrl =
  localStorage.firmwareUrl || "https://firmware.soulmatelights.com:8083/build";

let initialAppServerUrl =
  localStorage.appServerUrl || "https://server.soulmatelights.com/";

function Config() {
  // TODO: Rename to simualtorUrl, firmwareUrl, appServerUrl
  const [simulator, setSimulator] = useState(initialSimulatorUrl);
  const [firmware, setFirmware] = useState(initialFirmwareUrl);
  const [appServer, setAppServer] = useState(initialAppServerUrl);

  useEffect(() => {
    localStorage.simulatorUrl = simulator;
  }, [simulator]);
  useEffect(() => {
    localStorage.firmwareUrl = firmware;
  }, [firmware]);
  useEffect(() => {
    localStorage.appServerUrl = appServer;
  }, [appServer]);

  const url = (path) => normalizeUrl(appServer + "/" + path);

  const post = async (path, body = {}) => {
    return fetch(url(path), {
      method: "post",
      ...(await headersAndCredentials()),
      body: JSON.stringify({ ...body }),
    }).then((d) => d.json());
  };

  const postDelete = async (path, body = {}) => {
    return fetch(url(path), {
      method: "delete",
      ...(await headersAndCredentials()),
      body: JSON.stringify({ ...body }),
    }).then((d) => d.json());
  };

  const put = async (path, body = {}) => {
    const auth = await auth0Promise;
    const authenticated = await auth.isAuthenticated();
    const headers = {};
    if (authenticated) headers["Authorization"] = await auth.getTokenSilently();
    return fetch(url(path), {
      method: "PUT",
      credentials: "include",
      body,
    }).then((d) => d.json());
  };

  const get = async (path, params) => {
    return fetch(url(path) + "?" + new URLSearchParams(params), {
      ...(await headersAndCredentials()),
    }).then((d) => d.json());
  };

  const postWithToken = async (path, params) => {
    return fetch(url(path), {
      method: "post",
      ...(await headersAndCredentials()),
      body: JSON.stringify({ ...params }),
    }).then((d) => d.json());
  };

  return {
    simulator,
    setSimulator,
    firmware,
    setFirmware,
    appServer,
    setAppServer,
    headersAndCredentials,
    post,
    postDelete,
    put,
    get,
    postWithToken,
    createContainer,
  };
}

export default createContainer(Config);
