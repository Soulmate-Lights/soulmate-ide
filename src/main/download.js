import { AiFillApple, AiFillWindows } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import { Mode, useLightSwitch } from "use-light-switch";

import isElectron from "~/utils/isElectron";
function isMacintosh() {
  return navigator.platform.indexOf("Mac") > -1;
}

function isWindows() {
  return navigator.platform.indexOf("Win") > -1;
}

import screenshotDark from "./welcome/dark.png";
import screenshotLight from "./welcome/light.png";
const Download = () => {
  const dark = useLightSwitch() === Mode.Dark;

  return (
    <div className="flex flex-col items-center justify-center flex-grow px-20 py-10 width-full space-y-8">
      <span className="flex flex-col items-center text-center text-gray-600 dark-mode:text-white">
        <span className="text-5xl font-thin">Got Soulmate?</span>
        <p>
          Download the Desktop app to connect to your Soulmate and upload your
          creations.
        </p>
        <p></p>
      </span>
      {!isElectron() && (isWindows() || isMacintosh()) && (
        <div className="mt-auto opacity-75 bottom-8 hover:opacity-100 transition-opacity duration-500">
          <div className="mx-auto mt-4 sm:flex sm:justify-center space-x-4">
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
            <div className="shadow rounded-md">
              <a
                className="inline-flex items-center px-4 py-2 text-base font-medium text-purple-600 bg-white border border-transparent leading-6 rounded-md hover:text-purple-500 focus:outline-none focus:border-purple-300 focus:shadow-outline-gray active:bg-purple-50 active:text-purple-700 transition duration-150 ease-in-out"
                href="https://shop.soulmatelights.com/products/square"
                rel="noopener noreferrer"
                target="_blank"
              >
                <FaShoppingCart className="mr-2" />
                Buy a Soulmate Square ($199)
              </a>
            </div>
          </div>
        </div>
      )}
      <img
        src={dark ? screenshotDark : screenshotLight}
        style={{ maxWidth: "80%", maxHeight: "50%" }}
      />
    </div>
  );
};

export default Download;
