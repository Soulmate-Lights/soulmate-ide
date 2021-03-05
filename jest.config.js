module.exports = {
  setupFiles: ["<rootDir>/.jest/setEnvVars.js"],
  testPathIgnorePatterns: ["services/*", "node_modules"],
  watchman: false,
};
