module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          esmodules: true,
        },
      },
    ],
    "@babel/preset-react",
  ],
  plugins: [
    [
      "import",
      {
        libraryName: "@react-icons",
        camel2DashComponentName: false,
        transformToDefaultImport: false,
        customName: require("path").resolve(__dirname, "./react-icons.js"),
      },
      "@react-icons",
    ],
    [
      "babel-plugin-root-import",
      {
        rootPathSuffix: "./src/main",
        rootPathPrefix: "~/",
      },
    ],
    "@babel/plugin-proposal-optional-chaining",
    [
      "auto-import",
      {
        declarations: [
          {
            default: "React",
            path: "react",
            members: ["useState", "useEffect", "useContext", "useRef"],
          },
          {
            default: "PropTypes",
            path: "prop-types",
          },
          {
            default: "classnames",
            path: "classnames",
          },
        ],
      },
    ],
    [
      "@babel/plugin-proposal-class-properties",
      {
        loose: true,
      },
    ],
    "react-hot-loader/babel",
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: true,
      },
    ],
  ],
};
