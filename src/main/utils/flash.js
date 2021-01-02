if (!window.remote) {
  window.remote = undefined;
}

// import { prepareSketches } from "~/utils/code";
// import streamWithProgress from "~/utils/streamWithProgress";
const path = remote?.require("path");
// const fs = remote?.require("fs");
const IS_PROD = process.env.NODE_ENV === "production";
const getAppPath = remote?.app.getAppPath;
const isPackaged =
  remote?.process.mainModule.filename.indexOf("app.asar") !== -1;
const rootPath = remote?.require("electron-root-path").rootPath;
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
const installDependencies = () => {
  const childProcess = remote.require("child_process");
  if (remote.require("os").platform() === "darwin") {
    childProcess.execSync("/usr/bin/python ./get-pip.py", { cwd: dir });
    childProcess.execSync("/usr/bin/python -m pip install pyserial");
  } else {
    const which = remote && remote?.require("which");
    const python = which.sync("python");
    childProcess.execSync(`${python} ./get-pip.py`, { cwd: dir });
    const pip = which.sync("pip");
    childProcess.execSync(`${pip} install pyserial`);
  }
};

/** Flash a build file to a USB output */
export const flashBuild = async (port, file, progressCallback) => {
  const which = remote && remote?.require("which");
  let python = "/usr/bin/python";
  if (remote.require("os").platform() !== "darwin") {
    python = which.sync("python");
  }

  console.log("[flashbuild] Installing dependencices");
  try {
    installDependencies();
  } catch (e) {
    console.log("Error installing dependencies", e);
  }

  const cmd = `${python} ./esptool.py --chip esp32 --port ${port} --baud 1500000 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect 0xe000 ./ota_data_initial.bin 0x1000 ./bootloader.bin 0x10000 ${file} 0x8000 ./partitions.bin`;

  console.log("[flashBuild]", { cmd });

  const child = childProcess.exec(cmd, { cwd: dir });
  // let error = false;
  let errorOutput = [];
  // child.on("error", (e) => {
  //   // console.log("childProcess threw an error");
  //   // console.log(e);
  //   // throw e;
  //   // debugger;
  //   // error = e;
  // });
  child.stderr.on("data", (line) => {
    errorOutput = [...errorOutput, line];
  });
  child.stdout.on("data", (data) => {
    const number = getNumberFromFlashOutput(data);
    if (number) progressCallback(number);
  });

  await new Promise((resolve, reject) => {
    child.on("close", (code) => {
      progressCallback(100);
      if (code != 0) {
        reject(errorOutput);
      } else {
        resolve();
      }
    });
  });
};

/* We don't actually use this right now */
export const flashbuildToWifiSoulmate = async (ip, build, progressCallback) => {
  const url = `http://${ip}/ota`;
  var body = new FormData();
  const contents = fs.readFileSync(build);
  body.append("image", new Blob([contents]), "firmware.bin");
  await fetch(url, {
    method: "POST",
    body: body,
    mode: "no-cors",
    headers: {
      "Content-Length": fs.statSync(build).size,
    },
  });

  progressCallback(100);
};
