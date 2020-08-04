import Header from "./components/Header";
import Sketch from "./sketch";
import SketchesContainer from "~/containers/sketchesContainer";
import { useContainer } from "unstated-next";

const caret = (
  <path
    fillRule="evenodd"
    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
    clipRule="evenodd"
  />
);

const Gallery = ({ mine }) => {
  const { allSketches, sketches } = useContainer(SketchesContainer);

  const sketchesToShow = mine ? sketches : allSketches;

  return (
    <div className="flex flex-col">
      <Header
        title="Sketch Name"
        sections={[
          { title: "Gallery", to: "/gallery" },
          { title: "My patterns", to: "/my-patterns" },
        ]}
      />

      <div className="px-8 overflow-auto flex-shrink">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {sketchesToShow?.map((sketch) => (
            <Sketch key={sketch.id} sketch={sketch} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Gallery;
