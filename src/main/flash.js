import "./progress.pcss";

import { AiFillCheckCircle, AiOutlineUsb } from "react-icons/ai";

import { GiSquare } from "react-icons/gi";
import Header from "~/components/Header";
import Sketch from "~/components/sketch";
import SketchesContainer from "~/containers/sketches";
import Soulmates from "~/containers/soulmates";
import classnames from "classnames";
import compact from "lodash/compact";
import uniqBy from "lodash/uniqBy";

const Flash = () => {
  const { usbSoulmate, flashMultiple } = Soulmates.useContainer();
  const { allSketches } = SketchesContainer.useContainer();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  if (!allSketches) return <></>;

  const filteredSketches = allSketches?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedSketches = selected.map((id) =>
    allSketches.find((s) => s.id === id)
  );

  const disableFlashButton =
    selectedSketches.length === 0 || usbSoulmate.flashing;

  let users = uniqBy(
    filteredSketches?.map((sketch) => sketch.user),
    (user) => user.id
  );

  users = users?.map((u) => ({
    ...u,
    sketches: filteredSketches.filter((s) => s.user.id === u.id),
  }));

  const toggle = (sketch) => {
    if (usbSoulmate.flashing) return;

    if (selected.includes(sketch.id)) {
      setSelected(compact(selected.filter((i) => i !== sketch.id)));
    } else {
      setSelected([...selected, sketch.id]);
    }
  };

  const flash = () => {
    flashMultiple(
      usbSoulmate,
      selectedSketches,
      14,
      14,
      "ESP32",
      "APA102",
      4000
    );
  };

  return (
    <div className="flex flex-col flex-grow relative">
      <Header
        title="Flash"
        actions={[
          usbSoulmate && (
            <input
              key="search"
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="form-input block w-full sm:text-sm sm:leading-3"
            />
          ),
        ]}
      />

      {!usbSoulmate && (
        <div className="p-8 overflow-auto flex flex-col flex-grow flex-shrink items-center justify-center">
          <GiSquare className="w-20 h-20 text-gray-500 mb-5" />
          <AiOutlineUsb className="w-10 h-10 text-gray-500 mb-5" />
          Plug in your Soulmate with a USB cable to upload patterns to it.
        </div>
      )}

      {usbSoulmate && (
        <>
          <div className="p-8 overflow-auto flex flex-col flex-grow flex-shrink">
            {users?.map((user) => (
              <div className="pb-4" key={user.id}>
                <h3 className="mb-2 text-lg">{user.name}</h3>
                <div className="flex flex-row flex-wrap">
                  {user.sketches?.map((sketch) => (
                    <div
                      onClick={() => toggle(sketch)}
                      key={sketch.id}
                      className="relative mr-4 mb-4 cursor-pointer"
                    >
                      <Sketch sketch={sketch} />

                      {selected.includes(sketch.id) && (
                        <AiFillCheckCircle className="text-lg absolute top-2 right-2 text-white" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-row border-t py-4 px-8 bg-gray-300 border-gray-400 items-center">
            <div className="bottom-0 flex flex-col flex-wrap pr-4 flex-shrink">
              {selectedSketches.length === 0 && (
                <>Choose up to 20 patterns to upload to your Soulmate.</>
              )}

              {selectedSketches.length > 0 && (
                <div className="bottom-0 flex flex-row flex-wrap leading-none flex-shrink items-center pb-2">
                  Sketches to upload
                  <span className="bg-gray-400 rounded-full text-white inline px-2 py-1 ml-1 text-xs">
                    {selectedSketches.length}
                  </span>
                </div>
              )}

              <div className="bottom-0 flex flex-row flex-wrap flex-shrink max-h-48 overflow-auto">
                {selectedSketches.map((sketch) => (
                  <div
                    className="cursor-pointer relative mr-4 mb-4"
                    key={sketch.id}
                  >
                    <Sketch
                      sketch={sketch}
                      key={sketch.id}
                      onClick={() => toggle(sketch)}
                    />
                    <AiFillCheckCircle className="text-lg absolute top-2 right-2 text-white" />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center align-center ml-auto mr-2 flex-shrink-0">
              <span className="inline-flex rounded-md shadow-sm">
                <button
                  onClick={flash}
                  disabled={disableFlashButton}
                  type="button"
                  className={classnames(
                    "inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150",
                    {
                      "opacity-50": disableFlashButton,
                      "cursor-auto": disableFlashButton,
                    }
                  )}
                >
                  {usbSoulmate.flashing &&
                    usbSoulmate.usbFlashingPercentage === undefined &&
                    "Building, please wait..."}

                  {usbSoulmate.usbFlashingPercentage >= 0 && (
                    <progress
                      className="usb-flash my-2"
                      value={usbSoulmate.usbFlashingPercentage}
                      max="100"
                    >
                      {usbSoulmate.usbFlashingPercentage}%{" "}
                    </progress>
                  )}

                  {!usbSoulmate?.flashing && <>Flash to USB Soulmate</>}
                </button>
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Flash;
