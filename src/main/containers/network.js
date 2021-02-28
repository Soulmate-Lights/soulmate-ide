import normalizeUrl from "normalize-url";
import { createContainer } from "unstated-next";

import { auth0Promise } from "~/utils/auth";
import { headersAndCredentials } from "~/utils/network";

let initialSimulatorUrl =
  localStorage.simulatorUrl ||
  "https://editor.soulmatelights.com/sketches/build";

let initialFirmwareUrl =
  localStorage.firmwareUrl || "https://firmware.soulmatelights.com:8083/build";

let initialAppServerUrl =
  localStorage.appServerUrl || "https://editor.soulmatelights.com/";

if (process.env.LOCAL) {
  initialSimulatorUrl = "http://localhost:3001";
  initialFirmwareUrl = "http://localhost:8080/build";
  initialAppServerUrl = "http://localhost:8081/build";
}

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