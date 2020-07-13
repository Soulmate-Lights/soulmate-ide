import { SortableContainer, SortableElement } from "react-sortable-hoc";
import classnames from "classnames";
import { useContainer } from "unstated-next";
import SketchesContainer from "./containers/sketchesContainer";
import SoulmatesContainer from "./containers/soulmatesContainer.js";
import { FiCheckCircle, FiCircle } from "react-icons/fi";
import { MdReorder } from "react-icons/md";
import Config from "./Configuration";
import arrayMove from "array-move";

import Logo from "./images/logo.svg";
import "./styles/flash.css";

const SortableItem = SortableElement(({ value, id, rows, cols }) => {
  const sketch = value;
  const className = classnames("selectedSketch", {
    selected: sketch.id === id,
  });

  const invalidDimensions =
    sketch.config?.cols !== cols || sketch.config?.rows !== rows;

  return (
    <div className={className} key={sketch.id}>
      <MdReorder />
      <video loop src={sketch.video_url} autoPlay muted></video>
      {sketch.name}

      <span className={`dimensions ${invalidDimensions && "invalid"}`}>
        {sketch.config?.cols} x {sketch.config?.rows}
      </span>
    </div>
  );
});

const SortableList = SortableContainer(
  ({ items, toggleSketch, id, rows, cols }) => {
    return (
      <div>
        {items.map((sketch, index) => (
          <SortableItem
            key={`item-${sketch.id}`}
            index={index}
            value={sketch}
            id={id}
            toggleSketch={toggleSketch}
            rows={rows}
            cols={cols}
          />
        ))}
      </div>
    );
  }
);

const Flash = ({ id }) => {
  const {
    selectedSketches,
    setSelectedSketches,
    toggleSketch,
    buildSketch,
  } = useContainer(SketchesContainer);
  const {
    // soulmate,
    getSelectedSoulmate,
    soulmates,
    setSoulmate,
    flashMultiple,
    getConfig,
    saveConfig,
  } = useContainer(SoulmatesContainer);
  const soulmate = getSelectedSoulmate();
  const config = getConfig(soulmate);
  const { rows, cols, ledType, chipType, milliamps } = config;

  useEffect(() => {
    buildSketch(id, false, config);
  }, [soulmate, rows, cols, id]);

  const flash = () => {
    if (soulmate.flashing) return;
    flashMultiple(
      soulmate,
      selectedSketches,
      rows,
      cols,
      chipType,
      ledType,
      milliamps
    );
  };

  return (
    <div className="flashBackground">
      <div className="flash">
        <div className="selectedSketches" id="list">
          <div className="heading">Sketches selected</div>

          {selectedSketches.length === 0 && (
            <p className="empty">No sketches selected</p>
          )}

          <div className="sketchesList">
            <SortableList
              rows={rows}
              cols={cols}
              key={id}
              lockToContainerEdges
              lockAxis="y"
              toggleSketch={toggleSketch}
              items={selectedSketches}
              onSortEnd={({ oldIndex, newIndex }) => {
                const newSelectedSketches = arrayMove(
                  selectedSketches,
                  oldIndex,
                  newIndex
                );
                setSelectedSketches(newSelectedSketches);
              }}
            />
          </div>
        </div>

        <div className="flashConfiguration">
          <div className="chooseSoulmate">
            <div className="heading">Choose a Soulmate</div>
            {soulmates.map((s) => (
              <div
                key={s.addresses ? s.addresses[0] : s.port}
                className="chooseSoulmateSoulmate"
                onClick={() => setSoulmate(s)}
              >
                {s.name === soulmate?.name ? <FiCheckCircle /> : <FiCircle />}
                {s.name}
              </div>
            ))}
          </div>

          {soulmate && (
            <Config
              config={{ rows, cols, ledType, chipType }}
              setConfig={(config) => {
                saveConfig(soulmate, config);
              }}
            />
          )}

          {soulmate && (
            <div
              onClick={flash}
              disabled={soulmate.flashing}
              className="flashButton button"
            >
              {soulmate.flashing && <Logo className="loader" />}

              {soulmate.usbFlashingPercentage > -1 ? (
                <>
                  <progress
                    className="usb-flash"
                    value={soulmate.usbFlashingPercentage}
                    max="100"
                  >
                    {soulmate.usbFlashingPercentage}%{" "}
                  </progress>
                </>
              ) : (
                <>
                  {soulmate.flashing
                    ? `Flashing to ${soulmate.name}...`
                    : `Flash to ${soulmate.name}`}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Flash;
