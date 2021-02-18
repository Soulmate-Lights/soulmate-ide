import classnames from "classnames";

const Sketch = ({
  sketch,
  className,
  autoPlay,
  width = 24,
  showTitle = true,
  ...rest
}) => {
  const videoRef = useRef();
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (autoPlay) {
      setTimeout(() => {
        try {
          videoRef.current?.play();
        } catch (e) {
          // Don't quite know why these fail but they do!
          // https://sentry.io/organizations/soulmate/issues/2010933857/?environment=production&project=5433159&query=is%3Aunresolved
        }
      });
    }
  }, []);

  const imageStyle = {
    position: "absolute",
    left: 0,
    top: 0,
  };

  return (
    <div
      className={classnames(
        className,
        "flex flex-col text-center shadow overflow-hidden flex-shrink-0 group",
        "rounded-lg overflow-hidden shadow border border-gray-300 dark-mode:border-gray-700"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ width, height: width }}
      {...rest}
    >
      <div className="relative block w-full h-full bg-black">
        <img src={sketch.thumb_url} style={imageStyle} />
        {hover && (
          <video autoPlay loop muted style={imageStyle}>
            <source
              id="media-source"
              src={`${sketch.video_url}#t=0.5`}
              type="video/mp4"
            />
          </video>
        )}
      </div>
      {(showTitle || hover) && (
        <div className="z-10 p-1 opacity-75 group-hover:opacity-100">
          <h3 className="flex-grow-0 p-2 py-1 text-xs font-medium text-gray-900 truncate bg-white border-gray-500 rounded-lg dark-mode:border leading-5 opacity-90 dark-mode:bg-gray-700 dark-mode:text-white">
            {sketch.name}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Sketch;
