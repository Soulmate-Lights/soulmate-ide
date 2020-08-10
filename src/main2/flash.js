import "./progress.pcss";
import uniqBy from "lodash/uniqBy";
import classnames from "classnames";
import { GiSquare } from "react-icons/gi";
import { AiFillCheckCircle, AiOutlineUsb } from "react-icons/ai";
import compact from "lodash/compact";
import Header from "./components/Header";
import Sketch from "./components/sketch";
import SketchesContainer from "./containers/sketches";
import Soulmates from "./containers/soulmates";

const Flash = () => {
  const { usbSoulmate, flashMultiple } = Soulmates.useContainer();
  const { allSketches } = SketchesContainer.useContainer();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);

  if (!allSketches) return <></>;

  const filteredSketches = allSketches?.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const selectedSketches = allSketches.filter(({ id }) =>
    selected.includes(id)
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
        subtitle="Choose some patterns to flash to your Soulmate."
        actions={[
          <input
            key="search"
            autoFocus
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="form-input block w-full sm:text-sm sm:leading-3"
          />,
        ]}
      />

      {!usbSoulmate && (
        <div className="px-4 py-4 overflow-auto flex flex-col flex-grow flex-shrink items-center justify-center">
          <GiSquare className="w-20 h-20 text-gray-500 mb-5" />
          <AiOutlineUsb className="w-10 h-10 text-gray-500 mb-5" />
          Plug in your Soulmate with a USB cable to upload patterns to it.
        </div>
      )}

      {usbSoulmate && (
        <>
          <div className="px-4 py-4 overflow-auto flex flex-col flex-grow flex-shrink">
            {users?.map((user) => (
              <div className="pb-4" key={user.id}>
                <h3 className="mb-2 text-lg">{user.name}</h3>
                <ul className="grid flex-grow grid-cols-1 gap-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-8">
                  {user.sketches?.map((sketch) => (
                    <div
                      onClick={() => toggle(sketch)}
                      key={sketch.id}
                      className="relative"
                    >
                      <Sketch sketch={sketch} />

                      {selected.includes(sketch.id) && (
                        <AiFillCheckCircle className="text-lg absolute top-2 right-2 text-white" />
                      )}
                    </div>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-row border-t py-4 px-2">
            <div className="bottom-0 flex flex-row flex-wrap px-4 py-1 flex-shrink">
              {selectedSketches.length === 0 && (
                <>Choose up to 20 patterns to upload to your Soulmate.</>
              )}

              {selectedSketches.map((sketch) => (
                <Sketch
                  sketch={sketch}
                  key={sketch.id}
                  className="w-14 h-14 mr-2 my-1"
                  onClick={() => toggle(sketch)}
                />
              ))}
            </div>
            <div className="flex items-center align-center flex ml-auto mr-2 flex-shrink-0">
              <button
                onClick={flash}
                disabled={disableFlashButton}
                type="button"
                className={classnames(
                  "inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 ()):outline-none focus:shadow-outline-blue focus:border-blue-300 active:text-gray-800 active:bg-gray-50 transition duration-150 ease-in-out flex-shrink-0",
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Flash;
