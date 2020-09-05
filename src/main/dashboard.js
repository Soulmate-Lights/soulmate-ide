import { Link } from "react-router-dom";

import UserContainer from "~/containers/user";
import isElectron from "~/utils/isElectron";

const Dashboard = () => {
  const { userDetails, login } = UserContainer.useContainer();

  return (
    <div
      className="flex flex-col flex-grow w-full"
      style={{ WebkitAppRegion: "drag" }}
    >
      <div className="relative flex flex-col items-center justify-center flex-grow p-6 overflow-hidden">
        <nav className="absolute top-0 flex flex-row items-center justify-center justify-between w-full p-2 px-5 pt-5">
          <span className="inline-flex w-full rounded-md">
            {!userDetails && (
              <button
                onClick={login}
                href="#"
                className="inline-flex items-center px-4 py-2 ml-auto text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
              >
                Log in
              </button>
            )}
          </span>
        </nav>
        <main className="px-4 mx-auto max-w-screen-xl">
          <div className="text-center">
            <h2 className="flex text-4xl font-extrabold tracking-tight text-purple-900 leading-20 dark-mode:text-purple-400 sm:text-5xl sm:leading-none md:text-6xl lg:flex-row sm:flex-col">
              <span className="lg:mr-4">Soulmate</span>
              <span className="text-5xl text-purple-600 lg:text-6xl">
                LED firmware
              </span>
            </h2>
            <p className="max-w-md mx-auto mt-3 text-base text-purple-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              {"Making LED art easy and fun. Let's get started."}
            </p>
            <div className="mx-auto mt-5 sm:flex sm:justify-center md:mt-8">
              {!userDetails && (
                <div className="shadow rounded-md">
                  <Link
                    to="/tutorial"
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-purple-600 border border-transparent leading-6 rounded-md hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-gray transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                  >
                    Tutorial
                  </Link>
                </div>
              )}
              <div className="mt-3 shadow rounded-md sm:mt-0 sm:ml-3">
                <Link
                  to="/gallery"
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                >
                  Gallery
                </Link>
              </div>

              {userDetails && (
                <div className="mt-3 shadow rounded-md sm:mt-0 sm:ml-3">
                  <Link
                    to="/my-patterns"
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-purple-600 border border-transparent leading-6 rounded-md hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-gray transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                  >
                    My Patterns
                  </Link>
                </div>
              )}
            </div>

            {!isElectron() && (
              <div className="absolute opacity-25 bottom-8 hover:opacity-100 transition-opacity duration-500">
                <a
                  href="https://editor.soulmatelights.com/download"
                  className="inline-flex items-center px-4 py-2 mx-4 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                >
                  Download the desktop app
                </a>
                to upload your patterns right to your Soulmate.
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
