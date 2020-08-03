import { Link } from "react-router-dom";

const Sketch = ({ sketch }) => (
  <li
    key={sketch.id}
    className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow"
  >
    <Link className="flex-1 flex flex-col p-4" to={`/gallery/{sketch.id}`}>
      <video
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
      <h3 className="mt-6 text-gray-900 text-sm leading-5 font-medium truncate">
        {sketch.name}
      </h3>
      <dl className="mt-1 flex-grow flex flex-col justify-between">
        <dt className="sr-only">Title</dt>
        <dd className="text-gray-500 text-sm leading-5 truncate">
          {sketch.user.name}
        </dd>
      </dl>
    </Link>
  </li>
);

export default Sketch;
