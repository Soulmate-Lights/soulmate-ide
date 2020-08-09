import { Link } from "react-router-dom";

const Sketch = ({ sketch, to }) => (
  <li
    key={sketch.id}
    className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow overflow-hidden"
  >
    <Link className="flex-1 flex flex-col" to={to}>
      <video
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
      <div className="p-1">
        <h3 className="text-gray-900 text-sm leading-5 font-medium truncate">
          {sketch.name}
        </h3>
        <dl className="flex-grow flex flex-col justify-between text-gray-500 text-xs leading-5 truncate">
          {sketch.user.name}
        </dl>
      </div>
    </Link>
  </li>
);

export default Sketch;
