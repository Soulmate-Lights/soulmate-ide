import React, { useState, useEffect, useRef } from "react";
import history from "../utils/history";
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Link } from "react-router-dom";
import "./List.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import Logo from "./logo.svg";

const List = ({
  allSketches,
  sketches,
  soulmates,
  soulmate,
  setSoulmate,
  selectedSketch,
  add,
  destroy,
  userDetails,
}) => {
  const [addingNewSketch, setAddingNewSketch] = useState(false);
  const [showingAll, setShowingAll] = useState(!userDetails);
  const sketchesToShow = showingAll || !userDetails ? allSketches : sketches;

  useEffect(() => {
    setShowingAll(!userDetails);
  }, [userDetails]);

  useEffect(() => {
    selectedSketchRef.current?.scrollIntoViewIfNeeded();
  }, [selectedSketch?.id, sketches?.length]);

  useEffect(() => {
    if (sketchesToShow && allSketches && !selectedSketch) {
      const sketchToShow = sketchesToShow[0];
      if (sketchToShow) history.push(`/${sketchToShow.id}`);
    }
  }, [sketchesToShow, sketches, allSketches]);

  const selectedSketchRef = useRef();

  const anyFlashing = soulmates.some((s) => s?.flashing);

  return (
    <div className="list">
      <div className="heading">
        Sketches
        {userDetails && (
          <div className="toggle">
            <div
              onClick={() => {
                setShowingAll(false);
              }}
              className={!showingAll ? "selected" : ""}
            >
              Mine
            </div>
            <div
              onClick={() => {
                setShowingAll(true);
              }}
              className={showingAll ? "selected" : ""}
            >
              All
            </div>
          </div>
        )}
      </div>

      <div className="sketches">
        {!sketchesToShow && <Logo className="loader" />}

        {sketchesToShow?.map((sketch) => {
          const selected = sketch.id === selectedSketch?.id;
          const name = sketch.name || "Untitled";
          return (
            <Link
              to={`/${sketch.id}`}
              key={sketch.id}
              className={`sketch ${selected && "selected"}`}
              ref={selected ? selectedSketchRef : null}
            >
              <div className="video-wrapper">
                <video muted loop>
                  <source
                    id="media-source"
                    src={`${sketch.video_url}#t=2`}
                    type="video/mp4"
                  />
                </video>
              </div>
              {name.slice(0, 20)}
              {!showingAll && userDetails && (
                <RiDeleteBin2Line
                  className="delete"
                  onClick={() => {
                    if (!confirm("Delete this sketch?")) return;
                    const sketchIndex = sketches.findIndex(
                      (s) => s.id === sketch.id
                    );
                    const id = sketches[sketchIndex - 1]?.id;
                    setTimeout(() => history.push(`/${id}`));
                    destroy(sketch.id);
                  }}
                />
              )}
            </Link>
          );
        })}
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
                    if (anyFlashing) return;
                    setSoulmate(connected ? false : s);
                  }}
                >
                  {s.flashing ? (
                    <Logo className="loader" />
                  ) : (
                    <>
                      <>{s === soulmate ? <FiCheckCircle /> : <FiCircle />}</>
                    </>
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
