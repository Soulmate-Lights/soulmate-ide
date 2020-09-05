import CodeEditor from "~/components/codeEditor";
import Header from "~/components/Header";
import Simulator from "~/components/Simulator";
import BuildsContainer from "~/containers/builds";
import ConfigContainer from "~/containers/config";
import SelectionsContainer from "~/containers/selection";
import SketchesContainer from "~/containers/sketches";
import Soulmates from "~/containers/soulmates";
import Logo from "~/images/logo.svg";
import { emptyCode } from "~/utils/code";
import history from "~/utils/history";

const Editor = ({ id, mine }) => {
  const {
    getSketch,
    save,
    togglePublic,
    persistCode,
    deleteSketch,
  } = SketchesContainer.useContainer();
  const { getSelection, setSelection } = SelectionsContainer.useContainer();
  const { getBuild } = BuildsContainer.useContainer();
  const { config } = ConfigContainer.useContainer();
  const { rows, cols, serpentine } = config;

  const sketch = getSketch(id);

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

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  useEffect(() => {
    const closeMenu = (e) => {
      if (!menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const flash = async () => {
    const { config } = ConfigContainer.useContainer();
    const { soulmate, flashSketches } = Soulmates.useContainer();
    const result = await flashSketches(soulmate, sketch, config);
  };

  const menu = (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div>
        <span className="rounded-md shadow-sm">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
            id="options-menu"
            aria-haspopup="true"
            aria-expanded="true"
          >
            Options
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>

      {menuOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg z-20">
          <div
            className="rounded-md bg-white shadow-xs"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <div className="py-1">
              <button
                onClick={() => togglePublic(sketch.id)}
                className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 flex-grow w-full text-left"
                role="menuitem"
              >
                {sketch.public ? "Make private" : "Make public"}
              </button>
            </div>
            <div className="py-1">
              <a
                onClick={confirmAndDelete}
                href="#"
                className="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
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
      <Header
        title={
          <>
            {sketch.name}{" "}
            {sketch.public && (
              <div className="border rounded-full mx-2 text-xs px-2 py-1 leading-snug">
                Public
              </div>
            )}
          </>
        }
        sections={[
          !mine && { title: "Gallery", to: "/gallery" },
          !mine && {
            title: (
              <>
                <img
                  className="w-8 h-8 rounded-full mr-2"
                  src={sketch.user.image}
                />
                {sketch.user.name}
              </>
            ),
            to: `/user/${sketch.user.id}`,
          },
          mine && { title: "My patterns", to: "/my-patterns" },
        ]}
        actions={[
          menu,
          dirty && {
            title: mine ? "Save" : "Refresh",
            onClick: () => save(sketch.id, sketch.dirtyCode),
          },
        ]}
      />

      <div className="flex flex-row flex-grow w-full flex-shrink min-h-0">
        <CodeEditor
          build={build}
          selection={selection}
          className="flex-grow flex-shrink relative min-w-0 bg-white"
          code={code}
          onChangeSelection={(selection) => {
            setSelection(sketch.id, selection);
          }}
          onChange={(code) => {
            persistCode(sketch.id, code);
          }}
          onSave={(code) => {
            save(sketch.id, code);
          }}
        />

        <Simulator
          build={build}
          rows={rows}
          cols={cols}
          serpentine={serpentine}
          className="flex flex-col"
        />
      </div>
    </div>
  );
};

export default Editor;
