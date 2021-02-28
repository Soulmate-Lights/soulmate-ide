const child_process = require("child_process");
const { execSync } = child_process;

exports.default = function (_context) {
  execSync("rm -rf node_modules/monaco-editor/dev");
  execSync("rm -rf node_modules/monaco-editor/min-maps");
};
