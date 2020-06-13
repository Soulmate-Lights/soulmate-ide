import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useContainer } from "unstated-next";
import SketchesContainer from "./sketchesContainer";
import SoulmatesContainer from "./soulmatesContainer.js";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { TiDelete } from "react-icons/ti";
import { MdReorder } from "react-icons/md";
import "./flash.css";

const Flash = ({ id }) => {
  const { selectedSketches, toggleSketch, buildSketch } = useContainer(
    SketchesContainer
  );
  const {
    soulmate,
    soulmates,
    setSoulmate,
    flashMultiple,
    getConfig,
    saveConfig,
  } = useContainer(SoulmatesContainer);
  const config = getConfig(soulmate);
  const { rows, cols, ledType, chipType, milliamps } = config;

  useEffect(() => {
    buildSketch(id, false, config);
  }, [soulmate, rows, cols, id]);

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

        {selectedSketches.length === 0 && (
          <p className="empty">No sketches selected</p>
        )}

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

      <div className="flashConfiguration">
        <div className="chooseSoulmate">
          <div className="heading">Choose a Soulmate</div>
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

        <div className="heading">Configuration</div>
        <div className="configuration">
          <p>
            <label>Columns</label>
            <input
              type="number"
              value={cols}
              onChange={(e) => {
                const cols = parseInt(e.target.value);
                saveConfig(soulmate, { ...config, cols });
              }}
            />
          </p>
          <p>
            <label>LEDs</label>
            <select
              value={ledType}
              onChange={(e) => {
                saveConfig(soulmate, { ...config, ledType: e.target.value });
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
                saveConfig(soulmate, { ...config, rows });
              }}
            />
          </p>
          <p>
            <label>Chip type</label>
            <select
              value={chipType}
              onChange={(e) => {
                saveConfig(soulmate, { ...config, chipType: e.target.value });
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
                saveConfig(soulmate, {
                  ...config,
                  milliamps: parseInt(e.target.value),
                });
              }}
            />
          </p>
        </div>

        {soulmate && (
          <div
            onClick={() => {
              if (soulmate.flashing) return;
              flash();
            }}
            disabled={soulmate.flashing}
            className="flashButton button"
          >
            {soulmate.flashing
              ? `Flashing to ${soulmate.name}...`
              : `Flash to ${soulmate.name}`}
          </div>
        )}
      </div>
    </div>
  );
};
export default Flash;
