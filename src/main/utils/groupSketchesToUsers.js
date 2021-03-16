import sortBy from "lodash/sortBy";
import uniqBy from "lodash/uniqBy";

const groupSketchesToUsers = (allSketches) => {
  let users = uniqBy(
    allSketches?.map((sketch) => sketch.user),
    (user) => user?.id
  );
  users = users?.map((u) => ({
    ...u,
    sketches: allSketches.filter((s) => s.user?.id === u?.id),
  }));

  return (users = sortBy(users, (u) => -u.sketches.length));
};

export default groupSketchesToUsers;
