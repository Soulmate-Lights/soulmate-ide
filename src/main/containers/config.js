import isEmpty from "lodash/isEmpty";
import { createContainer } from "unstated-next";

// const isDev = require("electron-is-dev");
// export const host = isDev
//   ? "http://localhost:3001"
//   : "http://editor.soulmatelights.com";

export const host = "https://editor.soulmatelights.com";
export const url = (path) => host + path;

const types = [
  {
    playlists: true,
    label: "Soulmate Square",
    value: "square",
    config: {
      button: 39,
      data: 32,
      clock: 26,
      rows: 14,
      cols: 14,
      milliamps: 4000,
      ledType: "APA102",
      serpentine: true,
    },
  },
  {
    playlists: true,
    label: "Soulmate Tapestry",
    value: "tapestry",
    config: {
      button: 39,
      data: 32,
      clock: 26,
      rows: 70,
      cols: 15,
      milliamps: 8000,
      ledType: "APA102",
      serpentine: true,
    },
  },
  {
    label: "Soulmate Mini",
    value: "mini",
    config: {
      rows: 5,
      cols: 5,
      button: 39,
      data: 27,
      clock: 26,
      milliamps: 200,
      chipType: "atom",
      ledType: "WS2812B",
      serpentine: false,
    },
  },
  {
    label: "Custom",
    value: "custom",
    config: {},
  },
];

const playlistTypes = types.filter((t) => t.playlists);

export default createContainer(() => {
  let [type, setType] = useState(localStorage["type"] || "square");

  const [config, setConfig] = useState(
    localStorage["config"]
      ? JSON.parse(localStorage["config"])
      : {
          button: 39,
          data: 32,
          clock: 26,
          rows: 14,
          cols: 14,
          milliamps: 4000,
          ledType: "APA102",
          serpentine: true,
        }
  );

  const setConfigFromSoulmateData = (data) => {
    console.log({
      rows: data.rows,
      cols: data.cols,
      button: data.button,
      clock: data.clock,
      data: data.data,
      ledType: data.ledType,
      serpentine: data.serpentine,
      milliamps: data.milliamps,
    });
    setConfig({
      rows: data.rows,
      cols: data.cols,
      button: data.button,
      clock: data.clock,
      data: data.data,
      ledType: data.ledType,
      serpentine: data.serpentine,
      milliamps: data.milliamps,
    });
  };

  useEffect(() => {
    localStorage["type"] = type;
    const config = types.find((t) => t.value === type).config;
    if (!isEmpty(config)) setConfig(config);
  }, [type]);

  useEffect(() => {
    localStorage["config"] = JSON.stringify(config);
  }, [config]);

  const [useLocalInstall, setUseLocalInstall] = useState(false);

  return {
    config,
    setConfig,
    setConfigFromSoulmateData,
    types,
    playlistTypes,
    type,
    setType,
    useLocalInstall,
    setUseLocalInstall,
  };
});
