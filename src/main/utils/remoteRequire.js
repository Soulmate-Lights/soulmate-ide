// This isn't used, but I'm preserving it just in case we need it in future
// once we can't use nodeIntegration or process reuse.

import isDev from "./isDev";
import isElectron from "./isElectron";
import { isMac } from "./isMac";

export const remoteRequire = (module) => {
  if (!isElectron()) return false;

  if (isMac() && !isDev && isElectron()) {
    const path = `../app-${remote.process.arch}.asar/node_modules/${module}`;
    return remote.require(path);
  }

  return remote?.require(module);
};
