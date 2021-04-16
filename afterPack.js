const child_process = require("child_process");
const { execSync } = child_process;

exports.default = function (_context) {
  // your custom code
  console.log("Starting afterPack steps =====");
  execSync("yarn node-gyp clean");
  execSync("yarn electron-rebuild .");
  // TODO: I don't know whether we still actually need this.
  execSync("yarn build-electron");
  console.log("Finished afterPack steps =====");
};
