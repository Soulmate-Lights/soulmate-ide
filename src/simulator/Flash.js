import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContainer } from "unstated-next";
import SketchesContainer from "./sketchesContainer";
import SoulmatesContainer from "./soulmatesContainer.js";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { TiDelete } from "react-icons/ti";
import { MdReorder } from "react-icons/md";
import "./flash.css";

// const defaultConfig = {
//   rows: 70,
//   cols: 15,
//   chipType: "atom",
//   ledType: "APA102",
//   milliamps: 700,
// };

const Flash = ({ id }) => {
  const { selectedSketches, toggleSketch } = useContainer(SketchesContainer);
  const {
    soulmate,
    soulmates,
    setSoulmate,
    flashMultiple,
    getConfig,
    saveConfig,
  } = useContainer(SoulmatesContainer);
  // const [config, setConfig] = useState(getConfig(soulmate));
  const config = getConfig(soulmate);
  const setConfig = (config) => saveConfig(soulmate, config);
  const { rows, cols, ledType, chipType, milliamps } = config;

  const flash = () => {
    flashMultiple(
      soulmate,
      selectedSketches,
      rows,
      cols,
      ledType,
      chipType,
      milliamps
    );
  };

  return (
    <div className="flash">
      <div className="selectedSketches">
        <div className="heading">Sketches selected</div>
        {selectedSketches.map((sketch) => (
          <Link
            to={`/${sketch.id}`}
            className={`selectedSketch ${sketch.id === id ? "selected" : ""}`}
            key={sketch.id}
          >
            <MdReorder />
            <video loop src={sketch.video_url} autoPlay muted></video>
            {sketch.name}

            <TiDelete onClick={() => toggleSketch(sketch)} />
          </Link>
        ))}
      </div>

      <div className="chooseSoulmate">
        <div>
          Flash to:
          {soulmates.map((s) => (
            <div
              key={s.addresses[0]}
              className="chooseSoulmateSoulmate"
              onClick={() => setSoulmate(s)}
            >
              {s === soulmate ? <FiCheckCircle /> : <FiCircle />}
              {s.name}
            </div>
          ))}
        </div>

        <div className="configuration">
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
        </div>

        {soulmate && (
          <div onClick={flash} className="button">
            Flash to {soulmate.name}
          </div>
        )}

        {soulmate?.flashing && <div>Flashing...</div>}
      </div>
    </div>
  );
};
export default Flash;
