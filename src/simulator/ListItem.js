import React, { useRef, useEffect, useState } from "react";
import { FiCircle, FiCheckCircle } from "react-icons/fi";
import { useContainer } from "unstated-next";
import SketchesContainer from "./sketchesContainer";
import { FiEdit3 } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { Link } from "react-router-dom";

import { GoChevronDown, GoChevronRight } from "react-icons/go";

import isElectron from "./utils/isElectron";
import history from "../utils/history";
import "./List.css";

export const ListItemGroup = ({
  user,
  sketches,
  selectedSketchId,
  showControls,
  selectMode,
}) => {
  const includesSelectedSketch = sketches
    .map((s) => s.id.toString())
    .includes(selectedSketchId?.toString());

  const [open, setOpen] = useState(includesSelectedSketch);

  useEffect(() => {
    if (includesSelectedSketch) setOpen(true);
  }, [selectedSketchId]);

  return (
    <div>
      <span className="username" onClick={() => setOpen(!open)}>
        {user && <img src={user.image} />}
        {user?.name || "Unknown user"}
        {open ? <GoChevronDown /> : <GoChevronRight />}
        <span>{sketches.length}</span>
      </span>
      {open && (
        <div className="group">
          {sketches.map((sketch) => (
            <ListItem
              key={sketch.id}
              sketch={sketch}
              selected={sketch.id === selectedSketchId}
              showControls={showControls}
              selectMode={selectMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ListItem = ({ sketch, selected, showControls, selectMode }) => {
  const ref = useRef(null);
  const {
    rename,
    sketches,
    deleteSketch,
    selectedSketches,
    toggleSketch,
  } = useContainer(SketchesContainer);
  const [renaming, setRenaming] = useState(false);
  const name = sketch.name || "Untitled";

  const confirmAndDelete = () => {
    if (!confirm("Delete this sketch?")) return;
    const sketchIndex = sketches.findIndex((s) => s.id === sketch.id);
    const id = sketches[sketchIndex - 1]?.id;
    setTimeout(() => history.push(`/${id}`));
    deleteSketch(sketch.id);
  };

  if (isElectron()) {
    const useContextMenu = require("./useContextMenu").default;
    useContextMenu(
      ref,
      {
        showInspectElement: process.env.NODE_ENV !== "production",
        items: [
          {
            id: "rename-command",
            enabled: showControls,
            label: "Rename",
            click: () => setRenaming(true),
          },
          {
            id: "delete-command",
            enabled: showControls,
            label: "Delete",
            click: confirmAndDelete,
          },
        ],
      },
      []
    );
  }

  useEffect(() => {
    if (selected) ref.current.scrollIntoViewIfNeeded();
  }, [selected]);

  const inSelection = selectedSketches.map((s) => s.id).includes(sketch.id);

  return (
    <Link
      ref={ref}
      to={`/${sketch.id}`}
      key={sketch.id}
      className={`sketch ${selected && "selected"}`}
    >
      <div className="video-wrapper">
        <video muted loop>
          <source
            id="media-source"
            src={`${sketch.video_url}#t=0.5`}
            type="video/mp4"
          />
        </video>
      </div>

      {renaming ? (
        <input
          defaultValue={name}
          autoFocus
          onBlur={() => setRenaming(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const name = e.target.value;
              rename(sketch.id, name);
              setRenaming(false);
            }
            if (e.key === "Escape") {
              setRenaming(false);
            }
          }}
        />
      ) : (
        <span className="sketchName">
          {sketch.dirty && "•"} {name}
        </span>
      )}
      <div className="actions">
        {sketch.config.cols && (
          <span className="dimensions">
            {sketch.config?.cols} x {sketch.config?.rows}
          </span>
        )}
        {showControls && !isElectron() && (
          <>
            <FiEdit3
              className="rename action"
              onClick={() => setRenaming(true)}
            />
            <RiDeleteBin2Line
              className="delete action"
              onClick={confirmAndDelete}
            />
          </>
        )}
        {selectMode && (
          <>
            {inSelection ? (
              <FiCheckCircle
                onClick={() => {
                  if (selectMode) toggleSketch(sketch);
                }}
              />
            ) : (
              <FiCircle
                onClick={() => {
                  if (selectMode) toggleSketch(sketch);
                }}
              />
            )}
          </>
        )}
      </div>
    </Link>
  );
};
export default ListItem;
