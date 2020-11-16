import { FiLogIn, FiLogOut } from "react-icons/fi";

import UserContainer from "~/containers/user";

const UserDetails = ({ className }) => {
  const { userDetails, logout, login } = UserContainer.useContainer();

  return (
    <div className={classnames("flex-shrink-0 flex px-4 py-2", className)}>
      <div className="flex-grow flex-shrink-0 group">
        {!userDetails && (
          <div className="flex items-center flex-grow py-2">
            <button onClick={login}>Log in</button>

            <button
              className="flex items-center justify-center h-full ml-auto"
              onClick={login}
            >
              <FiLogIn />
            </button>
          </div>
        )}
        {userDetails && (
          <div className="flex items-center">
            <div>
              <img
                alt="avatar"
                className="inline-block rounded-full h-9 w-9"
                src={userDetails?.picture}
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium leading-5">
                {userDetails?.name}
              </p>
            </div>
            <button
              className="flex items-center justify-center h-full ml-auto"
              onClick={logout}
            >
              <FiLogOut />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
