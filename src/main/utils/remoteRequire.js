// This isn't used, but I'm preserving it just in case we need it in future
// once we can't use nodeIntegration or process reuse.

import path from "path";

import isDev from "./isDev";
import isElectron from "./isElectron";
import { isMac } from "./isMac";

export const remoteRequire = (module) => {
  if (!isElectron()) return false;

  if (isMac() && !isDev && isElectron()) {
    const fullPath = path.join(
      remote.app.getAppPath(),
      `../app-${remote.process.arch}.asar/node_modules/serialport`
    );
    return remote.require(fullPath);
  }

  return remote?.require(module);
};
