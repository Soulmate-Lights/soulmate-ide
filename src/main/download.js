import AiFillApple from "@react-icons/all-files/ai/AiFillApple";
import AiFillWindows from "@react-icons/all-files/ai/AiFillWindows";
import FaShoppingCart from "@react-icons/all-files/fa/FaShoppingCart";

import isElectron from "~/utils/isElectron";
import { isMac, isWindows } from "~/utils/isMac";

const Download = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-grow px-20 py-10 width-full space-y-24">
      <div className="space-y-4">
        <span className="flex flex-col items-center text-center text-gray-600 dark-mode:text-white">
          <span className="text-5xl font-thin">Need hardware?</span>
          <p className="mt-4">
            Buy one of our Soulmate Squares for 196 LEDs of jaw-dropping
            goodness.
            <br />
            uOr pick up a Soulmate DIY kit to create your own.
          </p>
        </span>

        {!isElectron() && (isWindows() || isMac()) && (
          <div className="mt-auto opacity-75 hover:opacity-100 transition-opacity duration-500">
            <div className="mx-auto sm:flex sm:justify-center space-x-4">
              <div className="shadow rounded-md">
                <a
                  className="inline-flex items-center px-4 py-2 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                  href="https://shop.soulmatelights.com/products/square"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FaShoppingCart className="mr-2" />
                  Buy a Square ($149)
                </a>
              </div>

              <div className="shadow rounded-md">
                <a
                  className="inline-flex items-center px-4 py-2 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                  href="https://shop.soulmatelights.com/products/soulmate-diy-kit"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <FaShoppingCart className="mr-2" />
                  Buy a DIY Kit ($10)
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <span className="flex flex-col items-center text-center text-gray-600 dark-mode:text-white">
          <span className="text-5xl font-thin">Got Soulmate?</span>
          <p className="mt-4">
            Download the Desktop app to connect to your Soulmate and upload your
            creations.
          </p>
        </span>
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
                  href="https://server.soulmatelights.com/download/mac"
                >
                  <AiFillApple className="mr-2" />
                  Download the app (Intel)
                </a>
              </div>
              <div className="shadow rounded-md">
                <a
                  className="inline-flex items-center justify-center w-full px-4 py-2 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                  href="https://server.soulmatelights.com/download/mac-arm64"
                >
                  <AiFillApple className="mr-2" />
                  Download the app (Apple Silicon)
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Download;
