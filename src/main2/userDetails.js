import { FiLogOut } from "react-icons/fi";
import UserContainer from "./containers/user";
import { useContainer } from "unstated-next";

const UserDetails = () => {
  const { userDetails, login, logout } = useContainer(UserContainer);

  return (
    <div className="flex-shrink-0 flex bg-gray-700 p-4">
      <a href="#" className="flex-shrink-0 group block">
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
            <p
              onClick={logout}
              className="text-xs leading-4 font-medium text-gray-300 group-hover:text-gray-200 transition ease-in-out duration-150"
            >
              Primo member
            </p>
          </div>
        </div>
      </a>

      <a className="text-white ml-auto justify-center items-center h-full flex">
        <FiLogOut />
      </a>
    </div>
  );
};

export default UserDetails;
