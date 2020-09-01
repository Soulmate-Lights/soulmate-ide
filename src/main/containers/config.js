import { createContainer } from "unstated-next";
import isEmpty from "lodash/isEmpty";

export default createContainer(() => {
  let [type, setType] = useState(localStorage["type"] || "square");

  const [config, setConfig] = useState(
    localStorage["config"]
      ? JSON.parse(localStorage["config"])
      : {
          data: 32,
          clock: 26,
          button: 39,
          milliamps: 4000,
          ledType: "APA102",
        }
  );

  useEffect(() => {
    localStorage["type"] = type;
    const config = types.find((t) => t.value === type).config;
    if (!isEmpty(config)) setConfig(config);
  }, [type]);

  useEffect(() => {
    localStorage["config"] = JSON.stringify(config);
  }, [config]);

  const types = [
    {
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
      },
    },
    {
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
      },
    },
    {
      label: "Custom",
      value: "custom",
      config: {},
    },
  ];

  return { config, setConfig, types, type, setType };
});
