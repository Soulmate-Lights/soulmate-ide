import Header from "./components/Header";
import Sketch from "./sketch";
import SketchesContainer from "~/containers/sketchesContainer";
import { useContainer } from "unstated-next";

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

      <div className="px-4 py-4 overflow-auto flex-shrink">
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
