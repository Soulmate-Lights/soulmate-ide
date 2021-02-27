import isElectron from "~/utils/isElectron";
if (!window.remote) {
  window.remote = undefined;
}

const path = remote?.require("path");
const IS_PROD = process.env.NODE_ENV === "production";
const getAppPath = remote?.app.getAppPath;
const isPackaged = remote?.process.mainModule.filename.indexOf(".asar") !== -1;
const rootPath = remote?.require(
  `../app-${electron.remote.process.arch}.asar/node_modules/electron-root-path`
).rootPath;
const childProcess = remote?.require("child_process");
const dir =
  IS_PROD && isPackaged
    ? path?.join(path.dirname(getAppPath()), "..", "./builder")
    : path?.join(rootPath, "builder");

// Flashing

/** Get a progress percentage from a USB flash serial output */
const getNumberFromFlashOutput = (data) => {
  try {
    const text = data.toString().trim();
    if (
      text.includes("Writing at 0x0000e000") ||
      text.includes("Writing at 0x00001000")
    ) {
      return;
    }

    let number = parseInt(text.split("...")[1].split("(")[1].split(" ")[0]);
    number = Math.min(number, 100);
    return number;
  } catch (e) {
    // nothing
  }
};

/* Make sure we have pyserial installed */
export const installDependencies = () => {
  const childProcess = remote.require("child_process");
  if (remote.require("os").platform() === "darwin") {
    childProcess.execSync("/usr/bin/python ./get-pip.py", { cwd: dir });
    childProcess.execSync(`/usr/bin/python -m pip install "pyserial>=3.5"`);
  } else {
    // `which` doesn't seem to work in Windows.
    // const which = remote && remote?.require("which");
    // const python = which.sync("python");
    // childProcess.execSync(`${python} ./get-pip.py`, { cwd: dir });
    // const pip = which.sync("pip");
    childProcess.execSync(`pip install "pyserial>=3.5"`);
  }
};

if (isElectron()) {
  console.log("[installDependencies] Installing dependencices");
  try {
    installDependencies();
  } catch (e) {
    console.log("Error installing dependencies", e);
  }
}

/** Flash a build file to a USB output */
export const flashBuild = async (port, file, progressCallback) => {
  let errorOutput = [];
  // const which = remote && remote?.require("which");
  let python = "/usr/bin/python";
  if (remote.require("os").platform() !== "darwin") {
    python = "python";
  }

  console.log(`[utils.flashBuild] Python: ${python}`);

  const cmd = `${python} ./esptool.py --chip esp32 -p ${port} --baud 1500000 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect 0xe000 ./ota_data_initial.bin 0x1000 ./bootloader.bin 0x10000 ${file} 0x8000 ./partitions.bin`;

  console.log("[flashBuild]", { cmd });

  const child = childProcess.exec(cmd, { cwd: dir });
  child.stderr.on("data", (line) => (errorOutput = [...errorOutput, line]));
  child.stdout.on("data", (data) => {
    const number = getNumberFromFlashOutput(data);
    if (number) progressCallback(number);
  });

  await new Promise((resolve, reject) => {
    child.on("close", (code) => {
      progressCallback(100);
      code == 0 ? resolve() : reject(errorOutput);
    });
  });
};

/* We don't actually use this right now */
export const flashbuildToWifiSoulmate = async (ip, build, progressCallback) => {
  const contents = fs.readFileSync(build);
  const url = `http://${ip}/ota`;
  var body = new FormData();
  body.append("image", new Blob([contents]), "firmware.bin");

  let progress = 0;
  const uploadInterval = setInterval(() => {
    progressCallback((progress += 1));
  }, 300);

  await fetch(url, {
    method: "POST",
    body,
    mode: "no-cors",
    headers: {
      "Content-Length": fs.statSync(build).size,
    },
  });

  clearInterval(uploadInterval);

  progressCallback(100);
};
