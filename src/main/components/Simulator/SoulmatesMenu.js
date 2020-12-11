import { FaRegPlayCircle } from "react-icons/fa";
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxCircleFill,
  RiCheckboxIndeterminateFill,
} from "react-icons/ri";

{
  /*
  TODO maybe: extra dropdown animation classes
  Dropdown panel, show/hide based on dropdown state.
  Entering: "transition ease-out duration-100"
  From: "transform opacity-0 scale-95"
  To: "transform opacity-100 scale-100"
  Leaving: "transition ease-in duration-75"
  From: "transform opacity-100 scale-100"
  To: "transform opacity-0 scale-95"
*/
}

const canStream = (soulmate) => parseInt(soulmate.config?.version) >= 8;

const SoulmatesMenu = ({ soulmates, selectedSoulmate, onChange }) => {
  const [open, setOpen] = useState();
  const wrapperRef = useRef();

  const handleClickOutside = (event) => {
    if (!wrapperRef.current.contains(event.target)) setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  if (soulmates.length === 0) return null;

  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      <div>
        <button
          aria-expanded="true"
          aria-haspopup="true"
          className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="options-menu"
          onClick={() => setOpen(!open)}
          type="button"
        >
          <FaRegPlayCircle className="w-4 h-4" />
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
        <div className="absolute right-0 z-10 w-auto mt-2 text-gray-700 bg-white shadow-lg origin-top-left rounded-md ring-1 ring-black ring-opacity-5">
          <div
            aria-labelledby="options-menu"
            aria-orientation="vertical"
            className="w-full py-1"
            role="menu"
          >
            <div className="px-4 pt-2 pb-1">
              <p className="text-sm text-gray-500">Mirror simulator to:</p>
            </div>
            {soulmates.map((soulmate, i) => {
              const enabled = canStream(soulmate);
              return (
                <div
                  className={classnames(
                    "whitespace-pre",
                    "flex flex-row items-center block pl-4 pr-8 py-2 text-sm space-x-1",
                    {
                      "text-gray-400": !enabled,
                      "cursor-pointer hover:bg-gray-100 hover:text-gray-900": enabled,
                    }
                  )}
                  key={i}
                  onClick={() =>
                    enabled &&
                    onChange(
                      soulmate === selectedSoulmate ? undefined : soulmate
                    )
                  }
                  role="menuitem"
                >
                  <span>
                    {enabled ? (
                      <>
                        {soulmate === selectedSoulmate ? (
                          <RiCheckboxCircleFill className="w-4 h-4 mr-1 text-purple-600" />
                        ) : (
                          <RiCheckboxBlankCircleFill className="w-4 h-4 mr-1 text-purple-600" />
                        )}
                      </>
                    ) : (
                      <RiCheckboxIndeterminateFill className="w-4 h-4 mr-1" />
                    )}
                  </span>

                  <span>
                    {soulmate.name}

                    {!enabled && soulmate.config && (
                      <span className="font-mono text-xs">
                        {" "}
                        (v{soulmate.config.version})
                      </span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
export default SoulmatesMenu;
