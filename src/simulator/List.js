import React, { useState, useEffect } from "react";
import history from "../utils/history";
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Logo from "./logo.svg";
import ListItem from "./ListItem";
import { useContainer } from "unstated-next";
import SketchesContainer from "./sketchesContainer";
import "./List.css";
import SoulmatesContainer from "./soulmatesContainer";

const List = ({ selectedSketch, destroy, userDetails }) => {
  const { sketches, allSketches, createSketch } = useContainer(
    SketchesContainer
  );
  const { soulmates, soulmate, setSoulmate } = useContainer(SoulmatesContainer);
  const [addingNewSketch, setAddingNewSketch] = useState(false);
  const [showingAll, setShowingAll] = useState(!userDetails);
  const sketchesToShow = showingAll || !userDetails ? allSketches : sketches;

  const add = async (name) => {
    const newSketch = await createSketch(name);
    history.push(`/${newSketch.id}`);
  };

  useEffect(() => {
    setShowingAll(!userDetails);
  }, [userDetails]);

  useEffect(() => {
    if (sketchesToShow && allSketches && !selectedSketch) {
      const sketchToShow = sketchesToShow[0];
      if (sketchToShow) history.push(`/${sketchToShow.id}`);
    }

    if (selectedSketch) {
      if (sketchesToShow?.map((s) => s.id)?.indexOf(selectedSketch?.id) == -1) {
        const sketchToShow = sketchesToShow[0];
        if (sketchToShow) history.push(`/${sketchToShow.id}`);
      }
    }
  }, [sketchesToShow, sketches, allSketches, showingAll]);

  return (
    <div className="list">
      <div className="heading">
        Sketches
        {userDetails && (
          <div className="toggle">
            <div
              onClick={() => setShowingAll(false)}
              className={!showingAll ? "selected" : ""}
            >
              Mine
            </div>
            <div
              onClick={() => setShowingAll(true)}
              className={showingAll ? "selected" : ""}
            >
              All
            </div>
          </div>
        )}
      </div>

      <div className="sketches">
        {!sketchesToShow && <Logo className="loader" />}

        {sketchesToShow?.map((sketch) => (
          <ListItem
            key={sketch.id}
            sketch={sketch}
            selected={sketch.id === selectedSketch?.id}
            showControls={!showingAll}
          />
        ))}
        <div className="shadow"></div>
      </div>

      {!showingAll && userDetails && sketches && (
        <>
          {addingNewSketch ? (
            <div className="newSketchName">
              <input
                autoFocus
                placeholder="Sketch name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    add(e.target.value);
                    setAddingNewSketch(false);
                  }
                  if (e.key === "Escape") {
                    setAddingNewSketch(false);
                  }
                }}
              />
              <button>Save</button>
            </div>
          ) : (
            <div
              className="new button"
              onClick={() => setAddingNewSketch(true)}
            >
              <AiOutlinePlusCircle />
              New sketch
            </div>
          )}
        </>
      )}

      <div className="soulmates">
        {soulmates.length > 0 && (
          <>
            <div className="heading">Soulmates</div>

            {soulmates.map((s) => {
              const connected = s === soulmate;
              return (
                <div
                  className={`device ${connected ? "connected" : ""}`}
                  key={s.name}
                  onClick={() => {
                    if (soulmates.some((s) => s?.flashing)) return;
                    setSoulmate(connected ? false : s);
                  }}
                >
                  {s.flashing ? (
                    <Logo className="loader" />
                  ) : (
                    <>{s === soulmate ? <FiCheckCircle /> : <FiCircle />}</>
                  )}
                  {s.name}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
};

export default List;
