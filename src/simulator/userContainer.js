import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";

import {
  getToken,
  tokenProperties,
  triggerLogin,
  triggerLogout,
} from "./utils/auth";

const UserContainer = () => {
  const [userDetails, setUserDetails] = useState(undefined);

  const fetchUser = async () => {
    const newUserDetails = await tokenProperties();
    if (newUserDetails) {
      localStorage.loginSaved = "true";
    }
    setUserDetails(newUserDetails);
  };

  useEffect(() => {
    if (localStorage.loginSaved) {
      getToken().then(() => {
        fetchUser();
      });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [window.auth?.tokenProperties?.id_token]);

  const login = async () => {
    console.log("login");
    await triggerLogin();
    fetchUser();
  };

  const logout = async () => {
    delete localStorage.loginSaved;
    await triggerLogout();
    fetchUser();
  };

  return { fetchUser, userDetails, login, logout };
};

export default createContainer(UserContainer);
