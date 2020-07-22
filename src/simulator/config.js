import { configs } from "~/utils/config";
import "./config.css";

const Configuration = ({ config, setConfig }) => {
  const { cols, rows, milliamps, ledType, chipType } = config;

  const startingType = Object.keys(configs).find(
    (configName) => config.rows === configs[configName].rows
  );

  const [type, setType] = useState(startingType);

  return (
    <div className="configuration">
      <p className="type">
        <label>Soulmate type:</label>
        <select
          value={type === "custom" ? "custom" : startingType}
          onChange={(e) => {
            setType(e.target.value);
            if (e.target.value !== "custom") {
              setConfig(configs[e.target.value]);
            }
          }}
        >
          {Object.keys(configs).map((name) => (
            <option key={name} value={name}>
              {name} ({configs[name].cols} x {configs[name].rows})
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </p>
      {type === "custom" && (
        <>
          <p>
            <label>Columns</label>
            <input
              type="number"
              value={cols}
              onChange={(e) => {
                const cols = parseInt(e.target.value);
                setConfig({ ...config, cols });
              }}
            />
          </p>
          <p>
            <label>LEDs</label>
            <select
              value={ledType}
              onChange={(e) => {
                setConfig({ ...config, ledType: e.target.value });
              }}
            >
              <option value="APA102">APA102</option>
              <option value="WS2812B">WS2812B</option>
            </select>
          </p>
          <p>
            <label>Rows</label>
            <input
              type="number"
              value={rows}
              onChange={(e) => {
                const rows = parseInt(e.target.value);
                setConfig({ ...config, rows });
              }}
            />
          </p>
          <p>
            <label>Chip type</label>
            <select
              value={chipType}
              onChange={(e) => {
                setConfig({ ...config, chipType: e.target.value });
              }}
            >
              <option value="atom">M5 Atom</option>
              <option value="d32">Lolin ESP32</option>
            </select>
          </p>
          <p>
            <label>Shape</label>
            <select disabled>
              <option>Rectangle</option>
              <option>Cylinder</option>
              <option>Hexagon</option>
            </select>
          </p>
          <p>
            <label>Power (mA)</label>
            <input
              type="number"
              step="100"
              value={milliamps}
              onChange={(e) => {
                setConfig({
                  ...config,
                  milliamps: parseInt(e.target.value),
                });
              }}
            />
          </p>
        </>
      )}
    </div>
  );
};

export default Configuration;
