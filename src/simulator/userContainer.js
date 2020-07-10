import { createContainer } from "unstated-next";
import { useState, useEffect } from "react";

import SketchesContainer from "./sketchesContainer";
import { useContainer } from "unstated-next";

import {
  signup as authSignup,
  login as authLogin,
  autoLogin,
  logout as authLogout,
} from "../authenticate";

const UserContainer = () => {
  const { reset } = useContainer(SketchesContainer);
  const [userDetails, setUserDetails] = useState(undefined);

  const signup = async (name, email, password) => {
    const user = await authSignup({ name, email, password });
    setUserDetails(user);
    reset();
  };

  const fetchUser = async () => {
    const user = await autoLogin();
    setUserDetails(user);
    reset();
  };

  useEffect(() => {
    (async () => {
      const user = await autoLogin();
      if (user) {
        setUserDetails(user);
        reset();
      } else {
        reset();
      }
    })();
  }, []);

  const login = async () => {
    const user = await authLogin("elliott.kember+test@gmail.com", "testing123");
    console.log(user);
    setUserDetails(user);
    fetchUser();
  };

  const logout = async () => {
    authLogout();
    setUserDetails(false);
    reset();
  };

  return { fetchUser, userDetails, login, logout };
};

export default createContainer(UserContainer);
