import { ImCross } from "react-icons/im";

const ResolutionPopup = ({ rows, cols, button, className, onChange }) => {
  const [open, setOpen] = useState();
  const wrapperRef = useRef();

  const handleClickOutside = (event) => {
    if (!wrapperRef.current?.contains(event.target)) setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  });

  const [config, setConfig] = useState({ rows, cols });

  return (
    <div
      className={classnames("relative inline-block text-left", className)}
      ref={wrapperRef}
    >
      <div onClick={() => setOpen(!open)}>
        <button
          aria-expanded="true"
          aria-haspopup="true"
          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="options-menu"
          type="button"
        >
          <span className="text-xs">
            {cols} x {rows}
          </span>
          <svg
            aria-hidden="true"
            className="w-5 h-5 ml-2 -mr-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {open && (
        <form
          className="absolute right-0 w-48 mt-2 bg-white rounded-lg shadow-lg origin-top-right ring-1 ring-black ring-opacity-5"
          onSubmit={() => {
            onChange(config);
            setOpen(false);
          }}
        >
          <div
            aria-labelledby="options-menu"
            aria-orientation="vertical"
            className="px-4 py-2 space-y-2"
            role="menu"
          >
            <div className="pt-2 pb-1">
              <p className="text-sm text-gray-500">Simulator resolution</p>
            </div>

            <div className="flex flex-row items-center flex-shrink mb-2 text-sm text-gray-500 space-x-4">
              <input
                autoFocus
                className="flex flex-shrink min-w-0 p-2 text-xs text-center bg-white border border-gray-600 rounded-lg leading-4"
                defaultValue={cols}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 10;
                  setConfig({ ...config, cols: value });
                }}
                onFocus={(e) =>
                  e.target.setSelectionRange(0, e.target.value.length)
                }
              />
              <span className="flex flex-shrink">
                <ImCross />
              </span>
              <input
                className="flex flex-shrink min-w-0 p-2 text-xs text-center bg-white border border-gray-600 rounded-lg leading-4"
                defaultValue={rows}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 10;
                  setConfig({ ...config, rows: value });
                }}
                onFocus={(e) =>
                  e.target.setSelectionRange(0, e.target.value.length)
                }
              />
            </div>

            <div className="flex justify-end py-2">
              <button
                className="flex-grow p-2 ml-auto button"
                onClick={() => {
                  onChange(config);
                  setOpen(false);
                }}
              >
                Update
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
export default ResolutionPopup;
