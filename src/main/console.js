import { parse } from "ansicolor";
import React from "react";
import { VscDebugRestart } from "react-icons/vsc";
import Style from "style-it";

import soulmatesContainer from "~/containers/soulmates";

const excludes = (line) => {
  if (line.includes("nvs: nothing saved.")) return false;
  if (line === "  [0m ") return false;

  return true;
};

const format = (line) => {
  const parsed = parse(line);

  return parsed.spans.map(({ css, text }, i) => (
    <React.Fragment key={i}>
      {Style.it(
        `.line {
      ${css}
      }`,
        <span className="line" key={i}>
          {text}
        </span>
      )}
    </React.Fragment>
  ));
};

const Console = ({ className }) => {
  const {
    text,
    flashing,
    usbFlashingPercentage,
    restart,
  } = soulmatesContainer.useContainer();

  const textDiv = useRef(false);

  const scrollToBottom = () => {
    if (textDiv.current) {
      textDiv.current.scrollTop = textDiv.current.scrollHeight;
    }
  };

  const autoscroll = () => {
    scrollToBottom();
    setTimeout(scrollToBottom, 10);
  };

  useEffect(autoscroll, [text, flashing]);

  useEffect(() => {
    window.addEventListener("resize", autoscroll);

    return () => {};
  });

  return (
    <div className="relative flex-grow w-full h-full">
      <div
        className={classnames(
          className,
          "p-2 overflow-auto font-mono text-xs text-green-400 bg-black",
          "h-full relative flex-grow"
        )}
        ref={textDiv}
        style={{ fontSize: 11 }}
      >
        {text.filter(excludes).map((line, i) => (
          <p className="w-full px-2 break-words" key={i}>
            {format(line)}
          </p>
        ))}

        {flashing && (
          <p className="relative block w-full h-6 pl-2 my-2 overflow-hidden break-words">
            <span
              className="absolute h-full bg-gray-500 rounded l-0 t-0"
              style={{ width: `${usbFlashingPercentage}%` }}
            ></span>
            <span className="absolute z-20 h-full px-2 py-1 text-white">
              {usbFlashingPercentage ? (
                <>Flashing new firmware ({usbFlashingPercentage || 0}%)</>
              ) : (
                <>Building...</>
              )}
            </span>
          </p>
        )}
      </div>

      <button
        className="absolute flex flex-row items-center px-4 py-2 text-sm text-gray-800 bg-white rounded right-4 bottom-4 space-x-2"
        onClick={restart}
      >
        <VscDebugRestart />
        <span>Restart</span>
      </button>
    </div>
  );
};

export default Console;
