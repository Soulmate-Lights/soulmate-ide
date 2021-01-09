import * as SentryReact from "@sentry/react";
import { mutate } from "swr";
import { createContainer } from "unstated-next";

import { handleLogin, triggerLogin, triggerLogout } from "~/utils/auth";
import { SKETCHES_URL } from "~/utils/urls";

const UserContainer = () => {
  const [userDetails, setUserDetails] = useState(undefined);

  useEffect(() => {
    handleLogin().then(setUserDetails);
  }, []);

  useEffect(() => {
    SentryReact.setUser({
      name: userDetails?.name,
      username: userDetails?.name,
      id: userDetails?.sub,
      avatarUrl: userDetails?.picture,
      ...userDetails,
    });

    mutate(SKETCHES_URL);
  }, [userDetails]);

  const login = async () => triggerLogin().then(setUserDetails);

  const logout = async () => {
    setUserDetails(undefined);
    triggerLogout();
  };

  const isAdmin = () =>
    userDetails?.sub === "google-oauth2|102941484361041922849";

  return { userDetails, login, logout, isAdmin };
};

export default createContainer(UserContainer);
