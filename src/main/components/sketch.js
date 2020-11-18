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

  return (
    <div
      className={classnames(
        className,
        "flex flex-col text-center bg-white shadow overflow-hidden",
        `w-${width}`,
        "border border-transparent dark-mode:border-gray-800"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...rest}
    >
      <div className={`block w-${width} h-${width} bg-black relative`}>
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
            ref={videoRef}
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
      {showTitle && (
        <div className="p-1 text-gray-900 dark-mode:bg-gray-700 dark-mode:text-white">
          <h3 className="text-xs font-medium truncate leading-5">
            {sketch.name}
          </h3>
        </div>
      )}
    </div>
  );
};

export default Sketch;
