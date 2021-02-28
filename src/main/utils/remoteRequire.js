import isDev from "./isDev";
import isElectron from "./isElectron";
import { isMac } from "./isMac";

export const remoteRequire = (module) => {
  if (!isElectron()) return false;

  if (isMac() && !isDev && isElectron()) {
    const path = `../app-${electron.remote.process.arch}.asar/node_modules/${module}`;
    return remote?.require(path);
  }

  return remote?.require(module);
};
