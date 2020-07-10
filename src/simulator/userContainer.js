import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";

import SketchesContainer from "./sketchesContainer";
import { useContainer } from "unstated-next";

import {
  getTokenOnStartup,
  tokenProperties,
  triggerLogin,
  triggerLogout,
} from "./utils/auth";

const UserContainer = () => {
  const { reset } = useContainer(SketchesContainer);
  const [userDetails, setUserDetails] = useState(undefined);

  const fetchUser = async () => {
    const newUserDetails = await tokenProperties();
    if (newUserDetails) {
      localStorage.loginSaved = "true";
    }
    setUserDetails(newUserDetails);
    reset();
  };

  useEffect(() => {
    if (localStorage.loginSaved) {
      getTokenOnStartup().then(() => {
        reset();
      });
    } else if (localStorage.token) {
      fetchUser();
    } else {
      reset();
    }
  }, []);

  const login = async () => {
    await triggerLogin();
    reset();
  };

  const logout = async () => {
    delete localStorage.loginSaved;
    await triggerLogout();
    reset();
  };

  return { fetchUser, userDetails, login, logout };
};

export default createContainer(UserContainer);
