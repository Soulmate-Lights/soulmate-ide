import { Helmet } from "react-helmet";
import { AiFillApple, AiFillWindows } from "react-icons/ai";
import { Link } from "react-router-dom";

import UserContainer from "~/containers/user";
import isDev from "~/utils/isDev";
import isElectron from "~/utils/isElectron";

import packagedotjson from "../../package.json";

function isMacintosh() {
  return navigator.platform.indexOf("Mac") > -1;
}

function isWindows() {
  return navigator.platform.indexOf("Win") > -1;
}

const Dashboard = () => {
  const { userDetails, login } = UserContainer.useContainer();

  return (
    <div className="flex flex-col flex-grow w-full">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="relative flex flex-col items-center justify-center flex-grow p-6 overflow-hidden">
        <nav className="absolute top-0 flex flex-row items-center justify-center justify-between w-full p-2 px-5 pt-5">
          <span className="inline-flex w-full rounded-md">
            {!userDetails && (
              <button
                className="inline-flex items-center px-4 py-2 ml-auto text-base font-medium text-purple-600 bg-white border border-transparent border-gray-300 leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                href="#"
                onClick={login}
              >
                Log in
              </button>
            )}
          </span>
        </nav>
        <main className="flex flex-col flex-grow max-h-full px-4 mx-auto text-center max-w-screen-xl">
          <div className="my-auto">
            <h2 className="flex flex-col text-4xl font-extrabold tracking-tight text-purple-900 leading-20 dark-mode:text-purple-400 sm:text-5xl sm:leading-none md:text-6xl">
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
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-purple-600 border border-transparent leading-6 rounded-md hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-gray transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                    to="/tutorial"
                  >
                    Tutorial
                  </Link>
                </div>
              )}
              <div className="mt-3 shadow rounded-md sm:mt-0 sm:ml-3">
                <Link
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                  to="/gallery"
                >
                  Gallery
                </Link>
              </div>

              {userDetails && (
                <div className="mt-3 shadow rounded-md sm:mt-0 sm:ml-3">
                  <Link
                    className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-purple-600 border border-transparent leading-6 rounded-md hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-gray transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                    to="/my-patterns"
                  >
                    My Patterns
                  </Link>
                </div>
              )}
            </div>
          </div>
          {!isElectron() && (
            <div className="mt-auto opacity-75 bottom-8 hover:opacity-100 transition-opacity duration-500">
              {isWindows() && (
                <div className="mx-auto mt-4 sm:flex sm:justify-center">
                  <div className="shadow rounded-md">
                    <a
                      className="inline-flex items-center px-4 py-2 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                      href={
                        isMacintosh()
                          ? "https://editor.soulmatelights.com/download/mac"
                          : "https://editor.soulmatelights.com/download/windows"
                      }
                    >
                      {isMacintosh() ? (
                        <AiFillApple className="mr-2" />
                      ) : (
                        <AiFillWindows className="mr-2" />
                      )}
                      Download the desktop app
                    </a>
                  </div>
                </div>
              )}
              {isMacintosh() && (
                <div className="flex flex-col mt-4 space-y-4 md:space-y-0 md:flex-row sm:justify-center md:space-x-4">
                  <div className="shadow rounded-md">
                    <a
                      className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                      href="https://editor.soulmatelights.com/download/mac"
                    >
                      <AiFillApple className="mr-2" />
                      Download the app (Intel)
                    </a>
                  </div>
                  <div className="shadow rounded-md">
                    <a
                      className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                      href="https://editor.soulmatelights.com/download/mac-arm64"
                    >
                      <AiFillApple className="mr-2" />
                      Download the app (Apple Silicon)
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-4 text-xs text-center opacity-25 dark-mode:text-white">
            Version {packagedotjson.version} {isDev && "(dev)"}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
