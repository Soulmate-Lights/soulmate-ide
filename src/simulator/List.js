import React, { useState, useEffect } from "react";
import Emojify from "react-emojione";
import keyBy from "lodash/keyBy";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import history from "../utils/history";
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Logo from "./logo.svg";
import ListItem, { ListItemGroup } from "./ListItem";
import { useContainer } from "unstated-next";
import SketchesContainer from "./sketchesContainer";
import SoulmatesContainer from "./soulmatesContainer";
import isElectron from "./utils/isElectron";
import "./List.css";

const List = ({ selectedSketch, userDetails, flashMode, setFlashMode }) => {
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

  const groupedSketches = groupBy(sketchesToShow, "user.id");
  const users = keyBy(map(sketchesToShow, "user"), "id");

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

        {showingAll
          ? map(groupedSketches, (sketches, id) => {
              const user = users[id];

              return (
                <ListItemGroup
                  key={user?.id}
                  user={user}
                  selectedSketchId={selectedSketch?.id}
                  sketches={sketches || []}
                  showControls={!showingAll}
                  selectMode={flashMode}
                />
              );
            })
          : map(sketches, (sketch) => (
              <ListItem
                key={sketch.id}
                sketch={sketch}
                selected={sketch.id === selectedSketch?.id}
                showControls={!showingAll}
                selectMode={flashMode}
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
              <div className="button">Save</div>
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
            <div className="heading">
              Soulmates
              {isElectron() && (
                <>
                  <div className="toggle">
                    <div
                      onClick={() => setFlashMode(false)}
                      className={!flashMode ? "selected" : ""}
                    >
                      Preview
                    </div>
                    <div
                      onClick={() => setFlashMode(true)}
                      className={flashMode ? "selected" : ""}
                    >
                      Flash
                    </div>
                  </div>
                </>
              )}
            </div>

            {soulmates.map((s) => {
              const connected = s.name === soulmate?.name;
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
                  <Emojify
                    style={{
                      height: 16,
                      width: 16,
                      position: "relative",
                      top: -1,
                    }}
                  >
                    {s.name}
                  </Emojify>
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
