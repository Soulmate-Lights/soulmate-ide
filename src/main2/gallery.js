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
      <div className="p-8">
        <div>
          <nav className="sm:hidden">
            <a
              href="#"
              className="flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              <svg
                className="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Back
            </a>
          </nav>
          <nav className="hidden sm:flex items-center text-sm leading-5 font-medium">
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              Gallery
            </a>
            <svg
              className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {caret}
            </svg>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              All patterns
            </a>
            <svg
              className="flex-shrink-0 mx-2 h-5 w-5 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {caret}
            </svg>
            <a
              href="#"
              className="text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out"
            >
              Back End Developer
            </a>
          </nav>
        </div>
        <div className="mt-2 md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate">
              {mine ? "My Patterns" : "Gallery"}
            </h2>
          </div>
          {/* <div className="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
            <span className="shadow-sm rounded-md">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out"
              >
                Edit
              </button>
            </span>
            <span className="ml-3 shadow-sm rounded-md">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700 transition duration-150 ease-in-out"
              >
                Publish
              </button>
            </span>
          </div> */}
        </div>
      </div>

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
