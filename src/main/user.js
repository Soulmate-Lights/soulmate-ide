import _ from "lodash";
import uniqBy from "lodash/uniqBy";
import moment from "moment";
import { Link } from "react-router-dom";

import Header from "~/components/Header";
import Sketch from "~/components/sketch";
import SketchesContainer from "~/containers/sketches";
import groupSketches from "~/utils/groupSketches";

const User = ({ id }) => {
  const { allSketches } = SketchesContainer.useContainer();

  let users = uniqBy(
    allSketches?.map((sketch) => sketch.user),
    (user) => user.id
  )?.map((u) => ({
    ...u,
    sketches: allSketches.filter((s) => s.user.id === u.id),
  }));

  let user = users.find((user) => user.id === parseInt(id));

  if (!user) return <></>;

  const { sketches = [] } = user;
  const groups = groupSketches(sketches);

  return (
    <div className="flex flex-col flex-grow ">
      <Header
        sections={[{ title: "Gallery", to: "/gallery" }]}
        title={
          <>
            <img className="w-8 h-8 mr-2 rounded-full" src={user.image} />
            {user.name}
          </>
        }
      />

      <div className="flex-grow overflow-auto bg-white dark-mode:bg-gray-900 dark-mode:text-white">
        <div className="flex flex-col flex-grow flex-shrink p-8 overflow-auto">
          {_.map(groups, ({ key, sketches }) => {
            return (
              <div key={key}>
                <h3 className="mb-2 text-lg">
                  {moment(sketches[0].updated_at).fromNow()}
                </h3>
                <div className="flex flex-row flex-wrap">
                  {sketches?.map((sketch) => (
                    <Link
                      className="mb-4 mr-4"
                      key={sketch.id}
                      to={`/gallery/${sketch.id}`}
                    >
                      <Sketch sketch={sketch} width={32} />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default User;
