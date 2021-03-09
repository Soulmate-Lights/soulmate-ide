import uniqBy from "lodash/uniqBy";

import CodeEditor from "~/components/codeEditor";
import Header from "~/components/Header";
import PlaylistMenu from "~/components/PlaylistMenu";
import Simulator from "~/components/Simulator";
import Sketch from "~/components/sketch";
import BuildsContainer from "~/containers/builds";
import NetworkContainer from "~/containers/network";
import useBuild from "~/hooks/useBuild";
import useSWR from "~/hooks/useSwr";
import Logo from "~/images/logo.svg";
import { emptyCode } from "~/utils/code";
import { getFullBuildAsBlob, prepareSketches } from "~/utils/code";
import history from "~/utils/history";
import {
  ALL_SKETCHES_PATH,
  PLAYLISTS_PATH,
  SKETCHES_PATH,
} from "~/utils/network";
const Playlist = (props) => {
  const id = parseInt(props.id);

  const { firmware, post, postDelete, put } = NetworkContainer.useContainer();

  const { data: mySketches = [] } = useSWR(SKETCHES_PATH);
  const { data: allSketches = [] } = useSWR(ALL_SKETCHES_PATH);
  const onlineSketches = uniqBy([...mySketches, ...allSketches], "id");
  const { data: playlists, mutate: mutatePlaylists } = useSWR(PLAYLISTS_PATH);

  const [publishing, setPublishing] = useState(false);
  const playlist = playlists?.find((p) => parseInt(p.id) === parseInt(id));
  const [sketches, setSketches] = useState(playlist?.sketches);
  const [index, setIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const [dirty, setDirty] = useState(false);

  const savePlaylist = async (id, data, blob) => {
    var formData = new FormData();
    formData.append("sketches", JSON.stringify(data.sketches));
    if (blob) formData.append("build", blob, "firmware.bin");
    await put(`/my-playlists/${id}?hi`, formData);
    mutatePlaylists();
  };

  const destroyPlaylist = async (id) => {
    await postDelete(`/my-playlists/${id}`);
    mutatePlaylists();
  };

  const unpublishPlaylist = async (id) => {
    await post(`/my-playlists/${id}/unpublish`);
    mutatePlaylists();
  };

  useEffect(() => {
    if (!sketches && playlist?.sketches) {
      setSketches(playlist.sketches);
      setIndex(0);
    }
  }, [playlist?.sketches]);

  useEffect(() => {
    if (index >= sketches?.length) setIndex(sketches.length - 1);
  }, [sketches, index]);

  const sketch = sketches ? sketches[index] : {};
  const { config } = playlist || {};

  const code = playlist?.sketches[index]?.code || emptyCode;
  const build = useBuild(code, config);

  const save = () => {
    savePlaylist(playlist.id, { sketches });
    setDirty(false);
  };

  const publish = async () => {
    setPublishing(true);
    const preparedCode = prepareSketches(sketches, config);
    let build = await getFullBuildAsBlob(preparedCode, firmware);

    // TODO: Catch errors here
    if (!build) {
      alert("There was an error building.");
    } else {
      await savePlaylist(playlist.id, { sketches }, build);
    }
    setPublishing(false);
  };

  if (!playlist) return <Logo className="loading-spinner" />;

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

      {menuOpen && (
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
                  // setRenaming(true);
                }}
                role="menuitem"
              >
                Rename
              </button>
            </div>
            <div className="py-1">
              <button
                className="flex-grow block w-full px-4 py-2 text-sm text-left text-gray-700 leading-5 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900"
                onClick={() => {
                  setMenuOpen(false);
                  destroyPlaylist(playlist.id);
                  history.push("/playlists");
                }}
                role="menuitem"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col flex-grow flex-shrink h-full">
      <Header
        actions={[
          dirty && { title: "Save", onClick: save },
          { title: publishing ? "Publishing..." : "Publish", onClick: publish },
          playlist.url && {
            title: "Un-publish",
            onClick: () => {
              unpublishPlaylist(playlist.id);
            },
          },
          menu,
        ]}
        sections={[{ title: "Playlists", to: "/playlists" }]}
        title={
          <>
            {playlist.name}
            <span className="px-4 py-2 mx-4 ml-4 text-sm text-gray-800 bg-gray-200 rounded-full border-1">
              {playlist.url ? "published" : "not published"}
            </span>
            {dirty && (
              <span className="px-4 py-2 ml-2 text-sm text-red-400 bg-red-200 rounded-full border-1">
                Has changes
              </span>
            )}
          </>
        }
      />

      <div className="flex flex-row flex-grow flex-shrink min-h-0">
        <div className="flex flex-col flex-shrink-0 h-full p-4 overflow-auto text-gray-800 border-r border-gray-200 w-72 dark-mode:border-gray-700">
          <PlaylistMenu
            index={index}
            onChange={(sketches) => {
              setSketches(sketches);
              savePlaylist(playlist.id, { sketches });
              setDirty(true);
            }}
            setIndex={setIndex}
            sketches={sketches}
          />

          <div
            className="block py-2 my-4 text-sm text-center text-white bg-indigo-500 rounded cursor-pointer align-center"
            onClick={() => setIndex(-1)}
          >
            Add from Gallery
          </div>
        </div>

        {index === -1 ? (
          <div className="flex flex-row flex-wrap items-start flex-shrink overflow-scroll">
            {onlineSketches.map((sketch) => (
              <div
                className="flex flex-grow-0 flex-shrink m-2 cursor-pointer"
                key={sketch.id}
                onClick={() => {
                  setSketches([
                    ...sketches,
                    { name: sketch.name, code: sketch.code },
                  ]);
                }}
                showTitle
              >
                <Sketch sketch={sketch} />
              </div>
            ))}
          </div>
        ) : (
          <>
            {sketches && sketches[index] ? (
              <div className="flex flex-row flex-grow flex-shrink min-w-0 min-h-0">
                <CodeEditor
                  build={build}
                  className="relative flex-grow flex-shrink w-6/12 min-w-0 min-h-0 bg-white"
                  code={sketch?.code || emptyCode}
                  key={index}
                  onChange={(code) => {
                    sketches[index].code = code;
                    setSketches(sketches);
                    setDirty(true);
                  }}
                  onSave={(code) => {
                    setDirty(false);
                    sketches[index].code = code;
                    setSketches(sketches);
                    savePlaylist(playlist.id, { sketches });
                  }}
                />

                <Simulator
                  build={build}
                  className="flex flex-col flex-grow"
                  config={config || {}}
                  hideResolutionMenu
                  minWidth={400}
                />
              </div>
            ) : (
              <Logo className="loading-spinner" />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const WrappedPlaylist = (props) => (
  <BuildsContainer.Provider>
    <Playlist {...props} />
  </BuildsContainer.Provider>
);

export default WrappedPlaylist;
