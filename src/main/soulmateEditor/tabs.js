import { AiOutlinePlus } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

const tabClasses = [
  "px-4 ml-1 py-2 flex flex-row items-center",
  "cursor-pointer whitespace-nowrap text-sm",
  "rounded-tl rounded-tr",
  "border border-b-0 border-gray-300 border-r-gray-400",
  "dark-mode:border-gray-500",
];

export const SortableTab = SortableElement(
  ({ sketch, sketchIndex, selectSketch, selected, removeSketch }) => {
    return (
      <div
        className={classnames(
          tabClasses,
          { "dark-mode:hover:bg-gray-500": !selected },
          { "bg-white": selected, "dark-mode:text-white": !selected }
        )}
        onClick={() => selectSketch(sketch)}
      >
        {sketch.name}
        <button
          className="ml-4 text-xs"
          onClick={() => removeSketch(sketchIndex)}
        >
          <ImCross className="w-2 h-2" />
        </button>
      </div>
    );
  }
);

export const SketchTabs = SortableContainer(
  ({
    items,
    selectedSketchIndex,
    removeSketch,
    selectSketch,
    adding,
    setAdding,
  }) => (
    <div className="flex flex-row items-end overflow-auto h-14">
      {items.map((value, index) => (
        <SortableTab
          index={index}
          key={`item-${value.name}`}
          removeSketch={removeSketch}
          selectSketch={selectSketch}
          selected={index === selectedSketchIndex}
          sketch={value}
          sketchIndex={index}
          value={value}
        />
      ))}

      <div
        className={classnames(
          tabClasses,
          { "text-gray-700": !adding },
          { "bg-white dark-mode:bg-white": adding },
          {
            "dark-mode:text-white dark-mode:bg-purple-500 dark-mode:text-white": !adding,
          }
        )}
        onClick={() => setAdding(!adding)}
      >
        <AiOutlinePlus className="mr-2" />
        Add a sketch
      </div>
    </div>
  )
);
