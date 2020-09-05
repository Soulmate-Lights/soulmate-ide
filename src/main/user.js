import uniqBy from "lodash/uniqBy";
import { Link } from "react-router-dom";

import Header from "~/components/Header";
import Sketch from "~/components/sketch";
import SketchesContainer from "~/containers/sketches";

const User = ({ id }) => {
  const { allSketches } = SketchesContainer.useContainer();
  let users = uniqBy(
    allSketches?.map((sketch) => sketch.user),
    (user) => user.id
  );

  users = users?.map((u) => ({
    ...u,
    sketches: allSketches.filter((s) => s.user.id === u.id),
  }));

  let user = users.find((user) => user.id === parseInt(id));

  if (!user) {
    return <></>;
  }

  return (
    <div className="flex flex-col flex-grow ">
      <Header
        title={
          <>
            <img className="w-8 h-8 mr-2 rounded-full" src={user.image} />
            {user.name}
          </>
        }
        sections={[{ title: "Gallery", to: "/gallery" }]}
      />

      <div className="flex-grow overflow-auto bg-white dark-mode:bg-gray-900 dark-mode:text-white">
        <div className="flex flex-row flex-wrap items-start p-8 overflow-auto bg-white dark-mode:bg-gray-900 dark-mode:text-white">
          {user.sketches.map((sketch) => (
            <Link
              to={`/gallery/${sketch.id}`}
              key={sketch.id}
              className="mb-4 mr-4"
            >
              <Sketch sketch={sketch} width={32} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default User;
