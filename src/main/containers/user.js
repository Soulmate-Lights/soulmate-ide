import * as SentryReact from "@sentry/react";
import isEmpty from "lodash/isEmpty";
import { mutate } from "swr";
import { createContainer } from "unstated-next";

import { callbackDesktop, signInDesktop, triggerLogin } from "~/utils/auth";
import { SKETCHES_URL } from "~/utils/urls";
import { url } from "~/utils/urls";

import isElectron from "../utils/isElectron";

const UserContainer = () => {
  const [userDetails, setUserDetails] = useState(undefined);

  const fetchUser = async (token) => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    fetch(url("/user"), {
      credentials: "include",
      headers,
    })
      .then((d) => d.json())
      .then((newUserDetails) => {
        if (isEmpty(newUserDetails)) return;
        localStorage.loginSaved = "true";
        setUserDetails(newUserDetails);
        mutate(SKETCHES_URL);
      });
  };

  useEffect(() => {
    if (window.location.pathname === "/desktop-sign-in") {
      signInDesktop();
    }

    if (window.location.pathname === "/desktop-callback") {
      callbackDesktop();
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    SentryReact.setUser({
      name: userDetails?.name,
      username: userDetails?.name,
      id: userDetails?.sub,
      avatarUrl: userDetails?.picture,
      ...userDetails,
    });
  }, [userDetails]);

  useEffect(() => {
    mutate(SKETCHES_URL);
  }, userDetails);

  const login = async () => {
    const token = await triggerLogin();
    fetchUser(token);
  };

  const isAdmin = () => {
    return userDetails?.sub === "google-oauth2|102941484361041922849";
  };

  const logout = async () => {
    setUserDetails(undefined);

    if (isElectron()) {
      remote.require("electron").session.defaultSession.clearStorageData;
    }

    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    delete localStorage.loginSaved;
  };

  return { fetchUser, userDetails, login, logout, isAdmin };
};

export default createContainer(UserContainer);
