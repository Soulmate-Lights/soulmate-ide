import NameLabel from "./NameLabel";

const NamesMenu = ({ sketches, className, onChange, index, setIndex }) => (
  <div
    className={classnames(
      "flex flex-col w-3/12 h-full text-gray-800 p-4",
      className
    )}
  >
    <nav aria-label="Sidebar" className="space-y-1">
      {sketches?.map((sketch, i) => (
        <div
          className={classnames(
            "cursor-pointer flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark-mode:text-white hover:text-gray-900 group rounded-md border-2 border-white border-opacity-0",
            {
              "text-gray-900 dark-mode:text-gray-900 bg-gray-300 border-opacity-100 ":
                i === index,
            }
          )}
          key={i}
          onClick={() => setIndex(i)}
        >
          <NameLabel
            className="flex-grow"
            disabled={i !== index}
            onChange={(newName) => {
              const newSketches = [...sketches];
              newSketches[i].name = newName;
              onChange(newSketches);
            }}
            value={sketch.name}
          />

          {i === index && (
            <div
              className="block ml-auto opacity-0 group-hover:opacity-100"
              onClick={() => onChange(sketches.filter((s) => s !== sketch))}
            >
              ❌
            </div>
          )}
        </div>
      ))}
    </nav>
    <div
      className="block py-2 my-4 text-sm text-center text-white bg-indigo-500 rounded cursor-pointer align-center"
      onClick={() => onChange([...sketches, {}])}
    >
      Add a pattern
    </div>
  </div>
);

export default NamesMenu;
