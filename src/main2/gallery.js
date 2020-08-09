import Header from "./components/Header";
import Sketch from "./components/sketch";
import SketchesContainer from "./containers/sketches";

const Gallery = ({ mine }) => {
  const { allSketches } = SketchesContainer.useContainer();
  const [search, setSearch] = useState("");

  const filteredSketches = allSketches?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col">
      <Header
        title="Gallery"
        actions={[
          <input
            key="search"
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="form-input block w-full sm:text-sm sm:leading-5"
          />,
        ]}
      />

      <div className="px-4 py-4 overflow-auto flex-shrink">
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8">
          {filteredSketches?.map((sketch) => (
            <Sketch
              key={sketch.id}
              sketch={sketch}
              to={mine ? `/my-patterns/${sketch.id}` : `/gallery/${sketch.id}`}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Gallery;
