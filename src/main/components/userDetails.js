import { FiLogIn, FiLogOut } from "@react-icons";

import UserContainer from "~/containers/user";

const UserDetails = ({ className }) => {
  const { userDetails, logout, login } = UserContainer.useContainer();

  return (
    <div
      className={classnames("flex flex-row w-full px-4 py-3 h-14", className)}
    >
      {!userDetails && (
        <button
          className="flex items-center flex-grow leading-5"
          onClick={login}
        >
          <span>Log in</span>

          <span
            className="flex items-center justify-center h-full ml-auto"
            onClick={login}
          >
            <FiLogIn />
          </span>
        </button>
      )}
      {userDetails && (
        <div className="flex flex-row items-center flex-shrink w-full min-w-0 space-x-2">
          <img
            alt="avatar"
            className="flex-shrink-0 inline-block object-cover rounded-full h-9 w-9"
            referrerPolicy="no-referrer"
            src={userDetails?.picture}
          />
          <div className="flex-grow flex-shrink min-w-0 text-sm font-medium truncate">
            {userDetails?.name}
          </div>
          <button
            className="flex items-center justify-center flex-shrink-0 ml-auto"
            onClick={logout}
          >
            <FiLogOut className="w-8 h-8 p-2 rounded hover:text-black hover:bg-white" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDetails;
