import normalizeUrl from "normalize-url";
import { createContainer } from "unstated-next";

import { auth0Promise } from "~/utils/auth";
import { headersAndCredentials } from "~/utils/network";

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
