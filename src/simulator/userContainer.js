import { createContainer } from "unstated-next";
import jwtDecode from "jwt-decode";
import { fetchJson, post, postDelete } from "./utils";
import React, { useState, useEffect } from "react";

const UserContainer = () => {
  const [userDetails, setUserDetails] = useState(undefined);

  const fetchUser = () => {
    const id_token = auth.tokenProperties?.id_token;
    let newUserDetails = false;
    if (id_token) {
      newUserDetails = jwtDecode(id_token);
      localStorage.loginSaved = "true";
    }
    setUserDetails(newUserDetails);
  };

  useEffect(() => {
    if (localStorage.loginSaved) {
      auth.getToken().then(() => {
        fetchUser();
      });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [auth.tokenProperties?.id_token]);

  const login = async () => {
    await auth.login();
    fetchUser();
  };

  const logout = async () => {
    delete localStorage.loginSaved;
    await auth.logout();
    fetchUser();
  };

  return { fetchUser, userDetails, login, logout };
};

export default createContainer(UserContainer);
