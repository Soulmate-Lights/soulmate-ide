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

  const size = `sm:w-${width / 2} sm:h-${
    width / 2
  } md:h-${width} md:w-${width}`;

  return (
    <div
      className={classnames(
        className,
        size,
        "flex flex-col text-center bg-white shadow overflow-hidden",
        "rounded-lg overflow-hidden shadow border border-gray-300 dark-mode:border-gray-700"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      <div className={`block ${size} bg-black relative`}>
        <img
          src={sketch.thumb_url}
          style={{
            transform: "rotate(180deg)",
            position: "absolute",
            left: 0,
            top: 0,
          }}
        />
        {hover && (
          <video
            autoPlay
            loop
            muted
            style={{
              transform: "rotate(180deg)",
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            <source
              id="media-source"
              src={`${sketch.video_url}#t=0.5`}
              type="video/mp4"
            />
          </video>
        )}
      </div>
      {showTitle && hover && (
        <div className="z-10 p-1 text-gray-900 bg-white opacity-90 dark-mode:bg-gray-700 dark-mode:text-white">
          <h3 className="text-xs font-medium truncate leading-5">
            {sketch.name}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Sketch;
