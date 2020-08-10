import { FiLogOut, FiLogIn } from "react-icons/fi";
import UserContainer from "~/containers/user";

const UserDetails = () => {
  const { userDetails, logout, login } = UserContainer.useContainer();

  return (
    <div className="flex-shrink-0 flex bg-gray-700 px-4 py-2">
      <div className="flex-shrink-0 group flex-grow">
        {!userDetails && (
          <div className="flex items-center text-white flex-grow py-2">
            <button onClick={login}>Log in</button>

            <button
              onClick={login}
              className="text-white ml-auto justify-center items-center h-full flex"
            >
              <FiLogIn />
            </button>
          </div>
        )}
        {userDetails && (
          <div className="flex items-center">
            <div>
              <img
                className="inline-block h-9 w-9 rounded-full"
                src={userDetails?.picture}
                alt="avatar"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm leading-5 font-medium text-white">
                {userDetails?.name}
              </p>
            </div>
            <button
              className="text-white ml-auto justify-center items-center h-full flex"
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
