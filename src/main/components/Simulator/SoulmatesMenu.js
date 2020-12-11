import { BiExport } from "react-icons/bi";
import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleLine,
} from "react-icons/ri";

const SoulmatesMenu = ({ soulmates, chosenSoulmate, onChange }) => {
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
          <BiExport className="w-4 h-4" />
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
      {/*
Dropdown panel, show/hide based on dropdown state.

Entering: "transition ease-out duration-100"
From: "transform opacity-0 scale-95"
To: "transform opacity-100 scale-100"
Leaving: "transition ease-in duration-75"
From: "transform opacity-100 scale-100"
To: "transform opacity-0 scale-95"
*/}
      {open && (
        <div className="absolute right-0 w-56 mt-2 text-gray-700 bg-white shadow-lg origin-top-left rounded-md ring-1 ring-black ring-opacity-5 zIndex-10">
          <div
            aria-labelledby="options-menu"
            aria-orientation="vertical"
            className="py-1"
            role="menu"
          >
            <div className="px-4 py-2">
              <p className="text-sm">Mirror to:</p>
            </div>
            {soulmates.map((soulmate, i) => (
              <div
                className="flex flex-row items-center block px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 hover:text-gray-900 space-x-2"
                key={i}
                onClick={() => onChange(soulmate)}
                role="menuitem"
              >
                {soulmate === chosenSoulmate ? (
                  <RiCheckboxCircleLine />
                ) : (
                  <RiCheckboxBlankCircleLine />
                )}
                <span>{soulmate.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default SoulmatesMenu;
