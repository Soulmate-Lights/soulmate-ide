import uniqBy from "lodash/uniqBy";
import Header from "./components/Header";
import Sketch from "./components/sketch";
import SketchesContainer from "./containers/sketches";

const Gallery = ({ mine }) => {
  const { allSketches } = SketchesContainer.useContainer();
  const [search, setSearch] = useState("");

  if (!allSketches) return <></>;

  const filteredSketches = allSketches?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  let users = uniqBy(
    filteredSketches?.map((sketch) => sketch.user),
    (user) => user.id
  );

  users = users?.map((u) => ({
    ...u,
    sketches: filteredSketches.filter((s) => s.user.id === u.id),
  }));

  return (
    <div className="flex flex-col flex-grow">
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

      <div className="px-4 py-4 overflow-auto flex flex-col flex-grow flex-shrink">
        {users?.map((user) => (
          <div className="pb-4" key={user.id}>
            <h3 className="mb-2 text-lg">{user.name}</h3>
            <ul className="grid flex-grow grid-cols-1 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
              {user.sketches?.map((sketch) => (
                <Sketch
                  key={sketch.id}
                  sketch={sketch}
                  to={
                    mine ? `/my-patterns/${sketch.id}` : `/gallery/${sketch.id}`
                  }
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
