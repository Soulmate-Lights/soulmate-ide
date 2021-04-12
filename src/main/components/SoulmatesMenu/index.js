import "@szhsin/react-menu/dist/index.css";

import { Menu, MenuHeader, MenuItem } from "@szhsin/react-menu";
import sortBy from "lodash/sortBy";
import { FaRegPlayCircle } from "react-icons/fa";

import Soulmates from "~/containers/soulmates";
import { canStream, isLoaded } from "~/utils/streaming";

import SoulmateMenuItem from "./SoulmateMenuItem";

const SoulmatesMenu = ({
  buttonClassName,
  button,
  text = "Mirror simulator to:",
  allowUsb,
  ...menuProps
}) => {
  let {
    soulmates,
    selectedSoulmate,
    setSelectedSoulmate,
  } = Soulmates.useContainer();

  const [open, setOpen] = useState();
  const wrapperRef = useRef();

  const handleClickOutside = (event) => {
    if (!wrapperRef.current?.contains(event.target)) setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  if (!soulmates) return null;
  if (soulmates.length === 0) return null;

  return (
    <div className="relative inline-block text-left" ref={wrapperRef}>
      <div onClick={() => setOpen(!open)}>
        <Menu
          {...menuProps}
          menuButton={
            button || (
              <button
                aria-expanded="true"
                aria-haspopup="true"
                className={classnames(
                  "inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500",
                  buttonClassName
                )}
                id="options-menu"
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
            )
          }
          offsetY={5}
          portal
        >
          <MenuHeader className="pl-4">{text}</MenuHeader>

          {sortBy(soulmates, (s) => s.config?.chipId).map((soulmate, i) => {
            let disabled = !canStream(soulmate) || !isLoaded(soulmate);
            if (allowUsb) disabled = false;

            return (
              <MenuItem
                className="pl-4"
                disabled={disabled}
                key={i}
                onClick={() => {
                  setSelectedSoulmate(
                    soulmate === selectedSoulmate ? undefined : soulmate
                  );
                }}
              >
                <SoulmateMenuItem
                  allowUsb={allowUsb}
                  disabled={disabled}
                  onSelect={setSelectedSoulmate}
                  selected={soulmate === selectedSoulmate}
                  soulmate={soulmate}
                />
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    </div>
  );
};
export default SoulmatesMenu;
