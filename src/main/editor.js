import { Helmet } from "react-helmet";
import { HiOutlineLink } from "react-icons/hi";
import { RiVideoDownloadLine } from "react-icons/ri";

import CodeEditor from "~/components/codeEditor";
import Header from "~/components/Header";
import Simulator from "~/components/Simulator";
import NetworkContainer from "~/containers/network";
import NotificationsContainer from "~/containers/notifications";
import SoulmatesContainer from "~/containers/soulmates";
import UserContainer from "~/containers/user";
import useBuild from "~/hooks/useBuild";
import useSWR from "~/hooks/useSwr";
import Logo from "~/images/logo.svg";
import { emptyCode } from "~/utils/code";
import history from "~/utils/history";
import { SKETCH_PATH, SKETCHES_PATH } from "~/utils/network";
import slugify from "~/utils/slugify";

import { PersonSection } from "./components/Header";

const Editor = ({ id }) => {
  const { post, postDelete } = NetworkContainer.useContainer();
  const { notify } = NotificationsContainer.useContainer();
  const { config } = SoulmatesContainer.useContainer();
  const { userDetails } = UserContainer.useContainer();
  const { mutate: mutateSketches } = useSWR(SKETCHES_PATH);
  const { data: sketch = { user: {} }, mutate: mutateSketch } = useSWR(
    SKETCH_PATH(id)
  );
  const [dirtyCode, setDirtyCode] = useState(sketch?.code);
  const mine = sketch?.user?.uid === userDetails?.sub;

  let code = dirtyCode || sketch?.code || emptyCode;
  const build = useBuild(code, config);

  const setSketchState = (id, options) => {
    mutateSketch({ ...sketch, ...options }, false);
  };

  const save = async (id, code, config) => {
    setDirtyCode(code);

    setSketchState(id, { code, config, dirty: false });

    if (!mine) return;
    await post("/sketches/save", {
      id,
      code,
      config,
    });
    mutateSketches();
  };

  const togglePublic = async (id) => {
    if (!mine) return;

    const isPublic = !sketch.public;
    setSketchState(id, { public: isPublic });
    await post("/sketches/save", {
      id,
      public: isPublic,
    });
    mutateSketches();
  };

  const persistCode = (id, code) => {
    if (!id) return;

    setSketchState(id, {
      dirty: sketch.code !== code,
    });
  };

  const deleteSketch = async (id) => {
    if (!mine) return;

    await postDelete(`/sketches/${id}`);
    // TODO redirect?
  };

  const rename = async (id, name) => {
    if (!mine) return;

    setSketchState(id, { name });
    post("/sketches/save", { id, name });
  };

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

  // if (!sketch) {
  //   return (
  //     <div className="flex flex-grow">
  //       <Logo className="loading-spinner" />
  //     </div>
  //   );
  // }

  const confirmAndDelete = () => {
    if (!confirm("Delete this sketch?")) return;
    setTimeout(() => history.push(`/my-patterns`));
    deleteSketch(sketch.id);
  };

  const menu = (
    <div className="relative inline-block text-left" ref={menuRef}>
      <div className="flex flex-row space-x-2">
        {sketch.video_url && (
          <span className="rounded-md shadow-sm">
            <a
              aria-expanded="true"
              aria-haspopup="true"
              className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md leading-5 hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition ease-in-out duration-150"
              href={sketch.video_url}
              id="options-menu"
              title="Download a video of this pattern"
              type="button"
            >
              <RiVideoDownloadLine className="w-5 h-5" />
            </a>
          </span>
        )}
        {mine && (
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
        )}
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
        </title>
        <meta
          content={`${sketch?.name} by ${sketch?.user?.name}`}
          property="og:title"
        />
        <meta
          content={`${sketch?.name} by ${sketch?.user?.name} | Soulmate IDE`}
          property="og:description"
        />
        <meta content={sketch.thumb_url} property="og:image" />
      </Helmet>
      <Header
        actions={[menu]}
        sections={[
          !mine && { title: "Gallery", to: "/gallery" },
          !mine && {
            title: <PersonSection user={sketch.user} />,
            to: `/gallery/user/${sketch.user.id}-${slugify(sketch.user.name)}`,
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
            {sketch.id ? (
              <CodeEditor
                build={build}
                className="relative flex-grow flex-shrink min-w-0 min-h-0 bg-white"
                code={code}
                key={sketch.id}
                onChange={(code) => persistCode(sketch.id, code)}
                onHesitation={setDirtyCode}
                onSave={(code) => save(sketch.id, code)}
              />
            ) : (
              <div className="flex flex-grow">
                <Logo className="loading-spinner" />
              </div>
            )}
          </div>

          {sketch.id && (
            <div className="flex-row items-center hidden p-4 py-3 text-sm border-t h-14 dark-mode:border-gray-700 md:flex">
              <span className="px-4 font-light">Public URL</span>
              <input
                className="flex-grow h-8 px-2 py-2 text-gray-900 border rounded-l dark-mode:bg-gray-200 dark-mode:border-gray-300"
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
                      `https://editor.soulmatelights.com/gallery/${
                        sketch.id
                      }-${slugify(sketch.name)}`
                    );
                    notify("Copied link to clipboard");
                  }}
                  type="button"
                >
                  <HiOutlineLink />
                </button>
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col border-l dark-mode:border-gray-700">
          <Simulator
            build={build}
            className="flex flex-col flex-grow"
            config={config}
            minWidth={400}
          />
        </div>
      </div>
    </div>
  );
};

export default Editor;
