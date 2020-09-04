import { prepareFullCodeWithMultipleSketches } from "~/utils/code";
import streamWithProgress from "~/utils/streamWithProgress";
const path = remote.require("path");
const fs = remote.require("fs");
const IS_PROD = process.env.NODE_ENV === "production";
const { getAppPath } = remote.app;
const isPackaged =
  remote.process.mainModule.filename.indexOf("app.asar") !== -1;
const rootPath = remote.require("electron-root-path").rootPath;
const childProcess = remote.require("child_process");
const dir =
  IS_PROD && isPackaged
    ? path.join(path.dirname(getAppPath()), "..", "./builder")
    : path.join(rootPath, "builder");

// Fetching

export const getBuild = async (sketches, config) => {
  const source = prepareFullCodeWithMultipleSketches(sketches, config);

  const res = await window.fetch("http://54.243.44.4:8081/build", {
    method: "POST",
    mode: "cors",
    credentials: "same-origin",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sketch: source }),
  });

  if (!res.ok) return false;

  const path = electron.remote.app.getPath("temp");
  const filename = parseInt(Math.random() * 10000000);
  const filePath = `${path}${filename}.bin`;
  const writer = fs.createWriteStream(filePath);
  const reader = res.body.getReader();
  const finalLength =
    length || parseInt(res.headers.get("Content-Length" || "0"), 10);
  await streamWithProgress(finalLength, reader, writer, () => {});

  return filePath;
};

// Flashing

/* Make sure we have pyserial installed */
const installDependencies = () => {
  const childProcess = remote.require("child_process");
  if (remote.require("os").platform() === "darwin") {
    // Ensure pyserial is installed before flashing
    if (!fs.existsSync(`/usr/local/bin/pip`)) {
      childProcess.execSync("python ./get-pip.py", { cwd: dir });
    }
    childProcess.execSync(`/usr/local/bin/pip install pyserial`);
  }
};

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

/** Flash a build file to a USB output */
export const flashBuildtoUSBSoulmate = async (port, file, progressCallback) => {
  installDependencies();

  const cmd = `python ./esptool.py --chip esp32 --port ${port} --baud 1500000 --before default_reset --after hard_reset write_flash -z --flash_mode dio --flash_freq 80m --flash_size detect 0xe000 ./ota_data_initial.bin 0x1000 ./bootloader.bin 0x10000 ${file} 0x8000 ./partitions.bin`;

  const child = childProcess.exec(cmd, { cwd: dir });
  child.on("error", console.log);
  child.stderr.on("data", console.log);
  child.stdout.on("data", (data) => {
    const number = getNumberFromFlashOutput(data);
    if (number) progressCallback(number);
  });

  await new Promise((resolve, _reject) => {
    child.on("close", () => {
      progressCallback(100);
      resolve();
    });
  });
};

/* We don't actually use this right now */
// export const flashbuildToWifiSoulmate = async (ip, build, progressCallback) => {
//   const url = `http://${ip}/ota`;
//   var body = new FormData();
//   const contents = fs.readFileSync(build);
//   body.append("image", new Blob([contents]), "firmware.bin");
//   await fetch(url, {
//     method: "POST",
//     body: body,
//     mode: "no-cors",
//     headers: {
//       "Content-Length": fs.statSync(build).size,
//     },
//   });

//   progressCallback(100);
// };
