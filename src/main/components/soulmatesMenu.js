{
  /*
    Dropdown panel, show/hide based on dropdown state.

    Entering: "transition ease-out duration-100"
From: "transform opacity-0 scale-95"
To: "transform opacity-100 scale-100"
    Leaving: "transition ease-in duration-75"
From: "transform opacity-100 scale-100"
To: "transform opacity-0 scale-95"
  */
}

import classnames from "classnames";

const SoulmatesMenu = ({ className }) => {
  const [open, setOpen] = useState(false);
  const soulmates = [{ name: "USB Soulmate" }];

  return (
    <div
      className={classnames(className, "relative inline-block text-left m-2")}
    >
      <div
        className={classnames(
          {
            hidden: !open,
          },
          "origin-top-right absolute left-0 bottom-12 mt-2 w-56 rounded-md shadow-lg"
        )}
      >
        <div className="bg-white rounded-md shadow-xs">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {soulmates.map(({ name }) => (
              <span
                key={name}
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 leading-5 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                role="menuitem"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <span className="rounded-md shadow-sm">
          <button
            onClick={() => setOpen(!open)}
            type="button"
            className="inline-flex w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md leading-5 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
          >
            Soulmates
          </button>
        </span>
      </div>
    </div>
  );
};

export default SoulmatesMenu;
