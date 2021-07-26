import { AiFillWindows } from "@react-icons/all-files/ai/AiFillApple";
import { AiFillApple } from "@react-icons/all-files/ai/AiFillApple";
import sortBy from "lodash/sortBy";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import Sketch from "~/components/sketch";
import UserContainer from "~/containers/user";
import useSWR from "~/hooks/useSwr";
import DiscordLogo from "~/images/discord.svg";
import isDev from "~/utils/isDev";
import isElectron from "~/utils/isElectron";
import { isMac, isWindows } from "~/utils/isMac";
import { ALL_SKETCHES_PATH } from "~/utils/network";

import packagedotjson from "../../package.json";
import { sketchUrl } from "./utils/urlHelpers";

const Dashboard = () => {
  const { userDetails, login } = UserContainer.useContainer();
  const { data: sketches } = useSWR(ALL_SKETCHES_PATH);

  return (
    <div className="flex flex-col flex-grow w-full">
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="relative flex flex-col items-center justify-center flex-grow flex-shrink p-6 overflow-auto">
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
              <div className="mt-3 shadow rounded-md sm:mt-0 sm:ml-3">
                <a
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-purple-600 border border-transparent leading-6 rounded-md hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-gray transition duration-150 ease-in-out md:py-4 md:text-lg md:px-10"
                  href="https://discord.gg/W9wAKFkYyF"
                  rel="noreferrer"
                  target="_blank"
                >
                  <DiscordLogo className="w-8 h-8 mr-4 -my-4 -ml-4" /> Discord
                </a>
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

          {sketches && (
            <div className="flex flex-col items-center w-8/12 mx-auto my-8">
              <h3>Latest patterns:</h3>
              <div
                className="flex flex-row flex-wrap justify-center flex-shrink"
                style={{ maxWidth: 1006 }}
              >
                {sortBy(sketches, (s) => -new Date(s.updated_at))
                  .slice(0, 12)
                  .map((sketch) => (
                    <Link
                      className="relative m-2"
                      key={sketch.id}
                      to={sketchUrl(sketch)}
                    >
                      {sketch.user?.image && (
                        <img
                          className="absolute z-10 w-8 h-8 border rounded-full"
                          src={sketch.user.image}
                          style={{ left: -8, top: -8 }}
                        />
                      )}
                      <Sketch sketch={sketch} width={92} />
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {!isElectron() && (
            <div className="mt-auto opacity-75 bottom-8 hover:opacity-100 transition-opacity duration-500">
              {isWindows() && (
                <div className="mx-auto mt-4 sm:flex sm:justify-center">
                  <div className="shadow rounded-md">
                    <a
                      className="inline-flex items-center px-4 py-2 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                      href={
                        isMac()
                          ? "https://server.soulmatelights.com/download/mac"
                          : "https://server.soulmatelights.com/download/windows"
                      }
                    >
                      {isMac() ? (
                        <AiFillApple className="mr-2" />
                      ) : (
                        <AiFillWindows className="mr-2" />
                      )}
                      Download the desktop app
                    </a>
                  </div>
                </div>
              )}
              {isMac() && (
                <div className="flex flex-col mt-4 space-y-4 md:space-y-0 md:flex-row sm:justify-center md:space-x-4">
                  <div className="shadow rounded-md">
                    <a
                      className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                      href="https://server.soulmatelights.com/download/mac-universal"
                    >
                      <AiFillApple className="mr-2" />
                      Download the app
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="p-4 text-xs text-center opacity-25 dark-mode:text-white">
            Version {packagedotjson.version} {isDev() && "(dev)"}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
