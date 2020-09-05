module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:tailwind/recommended",
  ],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
    monaco: "readonly",
    ipcRenderer: "readonly",
    module: "readonly",
    fs: "readonly",
    electron: "readonly",
    auth: "readonly",
    require: "readonly",
    process: "readonly",
    remote: "readonly",
    __dirname: "readonly",
    PropTypes: "readonly",
    React: "readonly",
    useEffect: "readonly",
    useRef: "readonly",
    useState: "readonly",
    useContext: "readonly",
    classnames: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks", "simple-import-sort", "auto-import"],
  parser: "babel-eslint",
  rules: {
    strict: 0,
    "react/prop-types": 0,
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "simple-import-sort/sort": "error",
    "tailwind/class-order": "error",
    "react/jsx-sort-props": "error",
  },
  settings: {
    react: {
      createClass: "createReactClass", // Regex for Component Factory to use,
      // default to "createReactClass"
      pragma: "React", // Pragma to use, default to "React"
      version: "detect", // React version. "detect" automatically picks the version you have installed.
      // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
      // default to latest and warns if missing
      // It will default to "detect" in the future
      flowVersion: "0.53", // Flow version
    },
    propWrapperFunctions: [
      // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
      "forbidExtraProps",
      { property: "freeze", object: "Object" },
      { property: "myFavoriteWrapper" },
    ],
    linkComponents: [
      // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
      "Hyperlink",
      { name: "Link", linkAttribute: "to" },
    ],
  },
};
