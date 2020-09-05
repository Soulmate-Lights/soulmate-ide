import classnames from "classnames";

const Sketch = ({
  sketch,
  className,
  autoPlay,
  width = 24,
  hideTitle,
  ...rest
}) => {
  const videoRef = useRef();

  useEffect(() => {
    if (autoPlay) {
      setTimeout(videoRef.current.play);
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
      {...rest}
    >
      <div className={`block w-${width} h-${width} bg-black`}>
        <video
          ref={videoRef}
          style={{ transform: "rotate(180deg)" }}
          muted
          loop
          onMouseEnter={(e) => e.target.play()}
          onMouseLeave={(e) => e.target.pause()}
        >
          <source
            id="media-source"
            src={`${sketch.video_url}#t=0.5`}
            type="video/mp4"
          />
        </video>
      </div>
      {!hideTitle && (
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
