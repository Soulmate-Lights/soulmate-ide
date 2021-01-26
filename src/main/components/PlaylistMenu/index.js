import NameLabel from "./NameLabel";

const sketchClass =
  "cursor-pointer flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark-mode:text-white hover:text-gray-900 dark-mode:hover:bg-white group";
const selectedClass = "text-gray-900 dark-mode:text-gray-900 bg-gray-300";

const NamesMenu = ({ sketches, onChange, index, setIndex }) =>
  sketches?.map((sketch, i) => {
    const selected = i == index;
    return (
      <div
        className={classnames(sketchClass, {
          [selectedClass]: selected,
        })}
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

        {selected && (
          <div
            className="block ml-auto opacity-0 group-hover:opacity-100"
            onClick={() => onChange(sketches.filter((s) => s !== sketch))}
          >
            ❌
          </div>
        )}
      </div>
    );
  }) || <></>;

export default NamesMenu;
