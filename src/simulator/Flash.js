import React from "react";
import { Link } from "react-router-dom";
import { useContainer } from "unstated-next";
import SketchesContainer from "./sketchesContainer";
import SoulmatesContainer from "./soulmatesContainer.js";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { TiDelete } from "react-icons/ti";
import { MdReorder } from "react-icons/md";
import "./flash.css";

const Flash = ({ id }) => {
  const { selectedSketches, toggleSketch } = useContainer(SketchesContainer);
  const { soulmate, soulmates, setSoulmate } = useContainer(SoulmatesContainer);
  const config = {};
  const { rows, cols, ledType, chipType, milliamps } = config;
  const saveConfig = () => {};

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
              key={s.id}
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
              defaultValue={rows}
              onChange={(e) => {
                const rows = parseInt(e.target.value);
                saveConfig({ ...config, rows });
              }}
            />
          </p>
          <p>
            <label>LEDs</label>
            <select
              defaultValue={ledType}
              onChange={(e) => {
                saveConfig({ ...config, ledType: e.target.value });
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
              defaultValue={cols}
              onChange={(e) => {
                const cols = parseInt(e.target.value);
                saveConfig({ ...config, cols });
              }}
            />
          </p>
          <p>
            <label>Chip type</label>
            <select
              defaultValue={chipType}
              onChange={(e) => {
                saveConfig({ ...config, chipType: e.target.value });
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
              defaultValue={milliamps}
              onChange={(e) => {
                saveConfig({
                  ...config,
                  milliamps: parseInt(e.target.value),
                });
              }}
            />
          </p>
        </div>

        {soulmate && <div className="button">Flash to {soulmate.name}</div>}
      </div>
    </div>
  );
};
export default Flash;
