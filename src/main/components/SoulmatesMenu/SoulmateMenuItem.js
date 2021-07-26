import "@szhsin/react-menu/dist/index.css";

import FaUsb from "@react-icons/all-files/fa/FaUsb";
import FaWifi from "@react-icons/all-files/fa/FaWifi";
import RiCheckboxBlankCircleFill from "@react-icons/all-files/ri/RiCheckboxBlankCircleFill";
import RiCheckboxCircleFill from "@react-icons/all-files/ri/RiCheckboxCircleFill";
import RiIndeterminateCircleLine from "@react-icons/all-files/ri/RiIndeterminateCircleLine";

import soulmateName from "~/utils/soulmateName";

const SoulmateMenuItem = ({
  soulmate,
  selected,
  allowUsb,
  disabled,
  className,
}) => {
  if (soulmate.type === "usb" && allowUsb) disabled = false;
  const CheckboxIcon = selected
    ? RiCheckboxCircleFill
    : RiCheckboxBlankCircleFill;
  const ConnectionIcon = soulmate.type === "usb" ? FaUsb : FaWifi;

  return (
    <div
      className={classnames(
        "flex flex-row text-xs text-sm whitespace-pre space-x-2 items-end",
        className
      )}
    >
      {!disabled ? (
        <CheckboxIcon
          className={classnames(
            "flex-shrink-0 w-5 h-5 text-purple-600 dark-mode:text-white",
            {
              "text-indigo-600 dark-mode:text-indigo-500": selected,
            }
          )}
        />
      ) : (
        <RiIndeterminateCircleLine className="flex-shrink-0 w-5 h-5" />
      )}

      <span className="leading-snug">
        <span className="truncate">{soulmateName(soulmate)}</span>
        {soulmate.config?.version && (
          <span className="ml-2 font-mono align-baseline text-2xs">
            (v{soulmate.config?.version})
          </span>
        )}
      </span>

      <ConnectionIcon className="w-4 h-4 ml-auto" />
    </div>
  );
};

export default SoulmateMenuItem;
