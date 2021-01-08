const child_process = require("child_process");
const { execSync } = child_process;

exports.default = function (_context) {
  // your custom code
  console.log("Starting afterPack steps =====");
  execSync("yarn node-gyp clean && yarn electron-rebuild . && yarn build");
  console.log("Finished afterPack steps =====");
};
