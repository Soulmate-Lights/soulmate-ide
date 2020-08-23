import Header from "~/components/Header";
import { Link } from "react-router-dom";
import Sketch from "~/components/sketch";
import SketchesContainer from "~/containers/sketches";
import _ from "lodash";
import uniqBy from "lodash/uniqBy";

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
            <img className="w-8 h-8 rounded-full mr-2" src={user.image} />
            {user.name}
          </>
        }
        sections={[{ title: "Gallery", to: "/gallery" }]}
      />

      <div className=" bg-white dark-mode:bg-gray-900 dark-mode:text-white flex-grow overflow-auto">
        <div className="p-8 overflow-auto flex items-start flex-wrap flex-row  bg-white dark-mode:bg-gray-900 dark-mode:text-white">
          {user.sketches.map((sketch) => (
            <Link
              to={`/gallery/${sketch.id}`}
              key={sketch.id}
              className="mr-4 mb-4"
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
