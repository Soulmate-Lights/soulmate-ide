import * as SentryReact from "@sentry/react";
import { createContainer } from "unstated-next";

import {
  getToken,
  getTokenOnStartup,
  tokenProperties,
  triggerLogin,
  triggerLogout,
} from "~/utils/auth";

import SketchesContainer from "./sketches";

const UserContainer = () => {
  const { reset } = SketchesContainer.useContainer();
  const [userDetails, setUserDetails] = useState(undefined);
  let [token, setToken] = useState(undefined);

  const fetch = async () => {
    const t = await getToken();
    if (token !== t) setToken(t);
  };

  useEffect(() => {
    fetch();
  }, [userDetails]);

  const fetchUser = async () => {
    const newUserDetails = await tokenProperties();
    if (newUserDetails) {
      localStorage.loginSaved = "true";
      SentryReact.setUser({
        name: newUserDetails.name,
        username: newUserDetails.name,
        id: newUserDetails.sub,
        avatarUrl: newUserDetails.picture,
        ...newUserDetails,
      });
    }

    setUserDetails(newUserDetails);
    reset();
  };

  useEffect(() => {
    if (localStorage.loginSaved) {
      getTokenOnStartup().then(() => {
        delete localStorage.loginPending;
        fetchUser();
      });
    } else if (localStorage.token) {
      delete localStorage.loginPending;
      fetchUser();
    } else {
      if (!localStorage.loginPending) {
        setUserDetails(false);
      }
      reset();
    }
  }, [localStorage.loginSaved, localStorage.token]);

  const login = async () => {
    await triggerLogin();
    fetchUser();
  };

  const isAdmin = () => {
    return userDetails?.sub === "google-oauth2|102941484361041922849";
  };

  const logout = async () => {
    delete localStorage.loginSaved;
    await triggerLogout();
    fetchUser();
  };

  return { fetchUser, userDetails, login, logout, isAdmin, token };
};

export default createContainer(UserContainer);
