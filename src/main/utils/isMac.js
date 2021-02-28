export function isMac() {
  return navigator.platform.indexOf("Mac") > -1;
}

export function isWindows() {
  return navigator.platform.indexOf("Win") > -1;
}

export default isMac;
