const child_process = require("child_process");
const { execSync } = child_process;

exports.default = async function () {
  // your custom code
  execSync("yarn node-gyp clean");
};
