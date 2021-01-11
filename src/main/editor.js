import { Helmet } from "react-helmet";
import { HiOutlineLink } from "react-icons/hi";
import useSWR, { mutate } from "swr";

import CodeEditor from "~/components/codeEditor";
import Header from "~/components/Header";
import Simulator from "~/components/Simulator";
import BuildsContainer from "~/containers/builds";
import NotificationsContainer from "~/containers/notifications";
import SoulmatesContainer from "~/containers/soulmates";
import Logo from "~/images/logo.svg";
import { fetcher, post, postDelete } from "~/utils";
import { emptyCode } from "~/utils/code";
import history from "~/utils/history";
import { ALL_SKETCHES_URL, SKETCHES_URL } from "~/utils/urls";

import { PersonSection } from "./components/Header";

const Editor = ({ id, mine }) => {
  const { data: sketches } = useSWR(SKETCHES_URL, fetcher);
  const { data: allSketches } = useSWR(ALL_SKETCHES_URL, fetcher);

  const sketch =
    sketches?.find((s) => s.id === parseInt(id)) ||
    allSketches?.find((s) => s.id === parseInt(id));

  const updateSketch = (id, options) => {
    if (sketches) {
      let sketchIndex = sketches?.findIndex((s) => s.id === id);
      if (sketchIndex > -1) {
        sketches[sketchIndex] = { ...sketches[sketchIndex], ...options };
        mutate(SKETCHES_URL, [...sketches], false);
      }
    }
    let allSketchIndex = allSketches?.findIndex((s) => s.id === id);
    if (allSketchIndex > -1) {
      allSketches[allSketchIndex] = {
        ...allSketches[allSketchIndex],
        ...options,
      };
      mutate(ALL_SKETCHES_URL, [...allSketches], false);
    }
  };

  const save = async (id, code, config) => {
    updateSketch(id, { code, dirtyCode: undefined, config, dirty: false });

    let sketchIndex = sketches?.findIndex((s) => s.id === id);

    if (sketchIndex > -1) {
      await post("/sketches/save", { id, code, config });
    }

    mutate(SKETCHES_URL);
  };

  const togglePublic = async (id) => {
    const sketch = sketches.find((s) => s.id === id);
    const isPublic = !sketch.public;
    updateSketch(id, { public: isPublic });
    await post("/sketches/save", { id, public: isPublic });
    mutate(SKETCHES_URL);
  };

  const persistCode = (id, code) => {
    if (!id) return;
    updateSketch(id, {
      dirtyCode: code,
      dirty: sketch.code !== code,
    });
  };

  const deleteSketch = async (id) => {
    mutate(
      SKETCHES_URL,
      sketches.filter((s) => s.id !== id),
      false
    );
    await postDelete(`/sketches/${id}`);
    mutate(SKETCHES_URL);
  };

  const rename = async (id, name) => {
    updateSketch(id, { name });
    post("/sketches/save", { id, name });
  };

  const { notify } = NotificationsContainer.useContainer();
  const { getBuild } = BuildsContainer.useContainer();
  const { config } = SoulmatesContainer.useContainer();

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
          mine && {
            title: mine ? "Save" : "Refresh",
            onClick: () => save(sketch.id, sketch.dirtyCode),
          },
        ]}
        sections={[
          !mine && { title: "Gallery", to: "/gallery" },
          !mine && {
            title: <PersonSection user={sketch.user} />,
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

      <div className="flex flex-row flex-grow flex-shrink min-w-0 min-h-0">
        <div className="flex flex-col flex-grow flex-shrink min-w-0 min-h-0">
          <div className="relative flex flex-grow flex-shrink block">
            <CodeEditor
              build={build}
              className="relative flex-grow flex-shrink min-w-0 min-h-0 bg-white"
              code={code}
              onChange={(code) => persistCode(sketch.id, code)}
              onSave={(code) => save(sketch.id, code)}
            />
          </div>
          <div className="flex flex-row items-center p-4 text-sm border-t dark-mode:border-gray-700">
            <span className="px-4 font-light">Public URL</span>
            <input
              className="flex-grow h-8 px-2 py-1 text-gray-900 border rounded-l dark-mode:bg-gray-200 dark-mode:border-gray-700"
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

        <div className="flex flex-col border-l dark-mode:border-gray-700">
          <Simulator
            build={build}
            className="flex flex-col flex-grow"
            minWidth={320}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
