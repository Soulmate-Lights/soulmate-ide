import { ImCross } from "react-icons/im";
import { SortableContainer, SortableElement } from "react-sortable-hoc";

export const SortableTab = SortableElement(
  ({ sketch, sketchIndex, selectSketch, selected, removeSketch }) => {
    return (
      <div
        className={classnames(
          "px-4 ml-1 py-2",
          "cursor-pointer whitespace-nowrap text-sm text-gray-700",
          "rounded-tl rounded-tr",
          "border border-b-0 dark-mode:border-gray-500 border-gray-400",
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
  ({ items, selectedSketchIndex, removeSketch, selectSketch }) => (
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
    </div>
  )
);
