import { SiPython } from "react-icons/si";

import Header from "~/components/Header";

function isWindows() {
  return navigator.platform.indexOf("Win") > -1;
}

const InstallPython = () => (
  <div className="flex flex-row flex-grow">
    <div className="relative flex flex-col flex-grow">
      <Header title="Install Python" />

      <div className="flex flex-col items-center justify-center flex-grow flex-shrink p-4 overflow-auto space-y-8">
        <SiPython className="w-32 h-32 mb-8 -mt-12 text-gray-400" />
        <span>You need to install Python to flash Soulmate firmware.</span>
        <span>Click this button to install Python from the Windows Store.</span>
        <button
          className="flex-grow-0 text-white whitespace-pre bg-purple-800 rounded-l-none hover:bg-purple-500 footer-button"
          onClick={installPython}
          type="button"
        >
          <SiPython className="w-8 h-8 mr-4 " />
          Install Python to flash Soulmates
        </button>
      </div>
    </div>
  </div>
);

const installPython = () => remote.require("child_process").exec("python.exe");

export const needsPython = () => {
  if (!isWindows()) return false;

  try {
    remote.require("which").sync("python");
  } catch (e) {
    return true;
  }

  return false;
};

export default InstallPython;
