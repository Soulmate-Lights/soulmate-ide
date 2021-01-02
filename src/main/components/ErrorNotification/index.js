import flatten from "lodash/flatten";

const ErrorNotification = ({ trace, dismiss }) => (
  <div className="fixed inset-0 z-10 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen px-4 px-10 pt-4 pb-20 text-center sm:block">
      {/*
Background overlay, show/hide based on modal state.

Entering: "ease-out duration-300"
  From: "opacity-0"
  To: "opacity-100"
Leaving: "ease-in duration-200"
  From: "opacity-100"
  To: "opacity-0"
    */}
      <div aria-hidden="true" className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75" />
      </div>
      {/* This element is to trick the browser into centering the modal contents. */}
      <span
        aria-hidden="true"
        className="hidden sm:inline-block sm:align-middle sm:h-screen"
      >
        ​
      </span>
      {/*
Modal panel, show/hide based on modal state.

Entering: "ease-out duration-300"
  From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  To: "opacity-100 translate-y-0 sm:scale-100"
Leaving: "ease-in duration-200"
  From: "opacity-100 translate-y-0 sm:scale-100"
  To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    */}
      <div
        aria-labelledby="modal-headline"
        aria-modal="true"
        className="inline-block px-4 pt-5 pb-4 overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:p-6"
        role="dialog"
      >
        <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
          <button
            className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="button"
          >
            <span className="sr-only">Close</span>
            {/* Heroicon name: x */}
            <svg
              aria-hidden="true"
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>
        <div className="sm:flex sm:items-start">
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
            {/* Heroicon name: exclamation */}
            <svg
              aria-hidden="true"
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
          <div className="flex-grow-0 flex-shrink mt-3 sm:mt-0 sm:ml-4 sm:text-left">
            <h3
              className="text-lg font-medium text-gray-900 leading-6"
              id="modal-headline"
            >
              Build error
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                There was an error building your sketches. This sometimes
                happens when two sketches conflict with each other.
                {trace && "Here's some more information that may be helpful:"}
              </p>
            </div>

            {trace && (
              <div className="flex-shrink w-full px-4 py-2 my-4 mr-8 overflow-hidden font-mono text-xs text-gray-500 border-red-200 rounded-lg bg-red-50 border-1 wrap">
                {flatten([trace.split("\n")])?.map((line, i) => (
                  <p className="break-none" key={i}>
                    {line?.trim()}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={dismiss}
            type="button"
          >
            {"That's OK, I'll try something else"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default ErrorNotification;
