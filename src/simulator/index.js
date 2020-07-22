import Simulator from "./Simulator";
import { hot } from "react-hot-loader";
import "./index.css";
import React, { useState } from "react";
import Editor from "./Editor";
import List from "./List";
import Logo from "./logo.svg";
import { useContainer } from "unstated-next";
import SketchesContainer from "./sketchesContainer";
import SelectionsContainer from "./selectionContainer";
import SoulmatesContainer from "./soulmatesContainer";
import UserContainer from "./userContainer.js";
import Flash from "./Flash";

const PatternEditor = ({ id }) => {
  const { getSketch, getBuild } = useContainer(SketchesContainer);
  const { soulmate, getConfig } = useContainer(SoulmatesContainer);
  const { userDetails } = useContainer(UserContainer);
  const selectedSketch = getSketch(id);
  const config = (soulmate && getConfig(soulmate)) ||
    selectedSketch?.config || { rows: 70, cols: 15 };
  const { rows = 70, cols = 15 } = config;
  const build = getBuild(selectedSketch, config);
  const [flashMode, setFlashMode] = useState(false);

  return (
    <>
      <List
        selectedSketch={selectedSketch}
        userDetails={userDetails}
        flashMode={flashMode}
        setFlashMode={setFlashMode}
      />
      {flashMode ? (
        <Flash id={id} />
      ) : (
        <>
          {!selectedSketch && (
            <div className="welcome">
              <Logo className="loader" />
            </div>
          )}
          {selectedSketch && !flashMode && (
            <Editor
              key={selectedSketch.id}
              sketch={selectedSketch}
              build={build}
            />
          )}
        </>
      )}
      {selectedSketch && !flashMode && (
        <div className="pixels">
          <Simulator
            key={`${selectedSketch.id}-${rows}-${cols}`}
            build={build}
            cols={cols}
            rows={rows}
            width={cols * 10}
            height={rows * 10}
          />
        </div>
      )}
    </>
  );
};

const HotPatternEditor = hot(module)((params) => (
  <SelectionsContainer.Provider>
    <SketchesContainer.Provider>
      <UserContainer.Provider>
        <SoulmatesContainer.Provider>
          <PatternEditor {...params} />
        </SoulmatesContainer.Provider>
      </UserContainer.Provider>
    </SketchesContainer.Provider>
  </SelectionsContainer.Provider>
));

export default HotPatternEditor;
