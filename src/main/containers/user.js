import * as SentryReact from "@sentry/react";

import useSWR from "~/hooks/useSwr";
import { logBackIn, logIn, logOut } from "~/utils/auth";
import { SKETCHES_PATH, USER_PATH } from "~/utils/network";
import { createContainer } from "~/utils/unstated-next";

const UserContainer = () => {
  const [userDetails, setUserDetails] = useState(undefined);
  const { mutate } = useSWR(SKETCHES_PATH);
  const { data: { admin } = {} } = useSWR(USER_PATH);

  useEffect(() => {
    logBackIn().then(setUserDetails);
  }, []);

  useEffect(() => {
    SentryReact.setUser({
      name: userDetails?.name,
      username: userDetails?.name,
      id: userDetails?.sub,
      avatarUrl: userDetails?.picture,
      ...userDetails,
    });

    if (userDetails) mutate();
  }, [userDetails?.sub]);

  const login = async () => logIn().then(setUserDetails);
  const logout = async () => logOut().then(setUserDetails);
  const isAdmin = () => admin;

  return { userDetails, login, logout, isAdmin };
};

export default createContainer(UserContainer);
