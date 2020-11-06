import _ from "lodash";
import moment from "moment";

const groupSketches = (sketches) => {
  const monthName = (item) =>
    parseInt(moment(item.updated_at, "YYYY-MM-DD").format("YM"));
  const groupedSketches = _.groupBy(sketches, monthName);
  const keys = Object.keys(groupedSketches)
    .map((key) => parseInt(key))
    .reverse();

  return keys.map((key) => ({ key, sketches: groupedSketches[key] }));
};

export default groupSketches;
