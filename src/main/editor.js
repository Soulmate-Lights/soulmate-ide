import { Helmet } from "react-helmet";
import { HiOutlineLink } from "react-icons/hi";

import CodeEditor from "~/components/codeEditor";
import Header from "~/components/Header";
import Simulator from "~/components/Simulator";
import BuildsContainer from "~/containers/builds";
import ConfigContainer from "~/containers/config";
import NotificationsContainer from "~/containers/notifications";
import SelectionsContainer from "~/containers/selection";
import SketchesContainer from "~/containers/sketches";
import SoulmatesContainer from "~/containers/soulmates";
import Logo from "~/images/logo.svg";
import { emptyCode } from "~/utils/code";
import history from "~/utils/history";
import isElectron from "~/utils/isElectron";

import FlashButton from "./components/flashButton";

const Editor = ({ id, mine }) => {
  const {
    getSketch,
    save,
    togglePublic,
    persistCode,
    deleteSketch,
    rename,
  } = SketchesContainer.useContainer();
  const { notify } = NotificationsContainer.useContainer();
  const { getSelection, setSelection } = SelectionsContainer.useContainer();
  const { getBuild } = BuildsContainer.useContainer();
  const { config } = ConfigContainer.useContainer();
  const { port } = SoulmatesContainer.useContainer();

  const sketch = getSketch(id);
  const menuRef = useRef();

  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName] = useState(sketch?.name);

  useEffect(() => {
    const closeMenu = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  if (!sketch) {
    return (
      <div className="flex flex-grow">
        <Logo className="loading-spinner" />
      </div>
    );
  }

  const build = getBuild(sketch.code || emptyCode, config);
  let code = sketch.dirtyCode || sketch.code || emptyCode;
  const selection = getSelection(id);
  const dirty = sketch.dirtyCode !== sketch.code;

  const confirmAndDelete = () => {
    if (!confirm("Delete this sketch?")) return;
    setTimeout(() => history.push(`/my-patterns`));
    deleteSketch(sketch.id);
  };

  const menu = (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div>
        <span className="rounded-md shadow-sm">
          <button
            aria-expanded="true"
            aria-haspopup="true"
            className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md leading-5 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            id="options-menu"
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
          >
            Options
            <svg
              className="w-5 h-5 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                fillRule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>

      {menuOpen && mine && (
        <div className="absolute right-0 z-20 w-56 mt-2 shadow-lg origin-top-right rounded-md">
          <div
            aria-labelledby="options-menu"
            aria-orientation="vertical"
            className="bg-white rounded-md shadow-xs"
            role="menu"
          >
            <div className="py-1">
              <button
                className="flex-grow block w-full px-4 py-2 text-sm text-left text-gray-700 leading-5 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                onClick={() => {
                  setMenuOpen(false);
                  togglePublic(sketch.id);
                }}
                role="menuitem"
              >
                {sketch.public ? "Make private" : "Make public"}
              </button>
            </div>
            <div className="py-1">
              <button
                className="flex-grow block w-full px-4 py-2 text-sm text-left text-gray-700 leading-5 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                onClick={() => {
                  setMenuOpen(false);
                  setRenaming(true);
                }}
                role="menuitem"
              >
                Rename
              </button>
            </div>
            <div className="py-1">
              <a
                className="block px-4 py-2 text-sm text-gray-700 leading-5 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                href="#"
                onClick={() => {
                  setMenuOpen(false);
                  confirmAndDelete();
                }}
                role="menuitem"
              >
                Delete
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col flex-grow flex-shrink min-w-0">
      <Helmet>
        <title>
          {sketch?.name
            ? `${sketch?.name} by ${sketch?.user?.name}`
            : "Loading sketch..."}{" "}
          &mdash; Soulmate IDE
        </title>
      </Helmet>
      <Header
        actions={[
          mine && menu,
          dirty && {
            title: mine ? "Save" : "Refresh",
            onClick: () => save(sketch.id, sketch.dirtyCode),
          },
        ]}
        sections={[
          !mine && { title: "Gallery", to: "/gallery" },
          !mine && {
            title: (
              <>
                <img
                  className="w-8 h-8 mr-2 rounded-full"
                  src={sketch.user.image}
                />
                {sketch.user.name}
              </>
            ),
            to: `/gallery/user/${sketch.user.id}`,
          },
          mine && { title: "My patterns", to: "/my-patterns" },
        ]}
        title={
          renaming ? (
            <>
              <input
                autoFocus
                className="px-2 border rounded-l"
                defaultValue={sketch.name}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setRenaming(false);
                    setNewName(sketch.name);
                  }

                  if (e.key === "Enter" && e.target.value) {
                    rename(sketch.id, newName);
                    setRenaming(false);
                  }
                }}
              />
              <button
                className="block px-4 py-2 text-sm text-left text-gray-700 border border-l-0 rounded-r leading-5 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                onClick={() => {
                  rename(sketch.id, newName);
                  setRenaming(false);
                }}
                role="menuitem"
              >
                Save
              </button>
            </>
          ) : (
            <>
              {sketch.name}{" "}
              {sketch.public && (
                <div className="px-2 py-1 mx-2 text-xs leading-snug border rounded-full">
                  Public
                </div>
              )}
            </>
          )
        }
      />

      <div className="flex flex-row flex-grow flex-shrink w-full min-h-0">
        <div className="flex flex-col flex-grow flex-shrink min-w-0 ">
          <CodeEditor
            build={build}
            className="relative flex-grow flex-shrink min-w-0 bg-white"
            code={code}
            onChange={(code) => persistCode(sketch.id, code)}
            onChangeSelection={(selection) =>
              setSelection(sketch.id, selection)
            }
            onSave={(code) => save(sketch.id, code)}
            selection={selection}
          />
          <div className="flex flex-row items-center p-4 text-sm border-t ">
            <span className="px-4 font-light">Public URL</span>
            <input
              className="flex-grow h-8 px-2 py-1 border rounded-l"
              onClick={(e) => {
                e.target.select();
              }}
              readOnly
              value={`https://editor.soulmatelights.com/gallery/${sketch.id}`}
            />
            <span className="inline-flex rounded-md shadow-sm">
              <button
                className="inline-flex items-center h-8 text-xs font-medium text-white bg-purple-600 border border-transparent rounded rounded-l-none px-2.5 leading-4 hover:bg-purple-500 focus:outline-none focus:border-purple-700 focus:shadow-outline-purple active:bg-purple-700 transition ease-in-out duration-150"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://editor.soulmatelights.com/gallery/${sketch.id}`
                  );
                  notify("Copied link to clipboard");
                }}
                type="button"
              >
                <HiOutlineLink />
              </button>
            </span>
          </div>
        </div>

        <div className="flex flex-col border-l">
          <Simulator
            build={build}
            className="flex flex-col flex-grow"
            config={config}
            minWidth={320}
          />

          {isElectron() && port && (
            <FlashButton
              className="m-4"
              disabled={!build || build?.stderr}
              selectedSketches={[sketch]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
