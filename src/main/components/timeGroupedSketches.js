import _ from "lodash";
import moment from "moment";
import { Link } from "react-router-dom";

import Sketch from "~/components/sketch";
import Logo from "~/images/logo.svg";

const groupSketches = (sketches) => {
  const monthName = (item) =>
    parseInt(moment(item.updated_at, "YYYY-MM-DD").format("YMM"));
  const groupedSketches = _.groupBy(sketches, monthName);
  const keys = Object.keys(groupedSketches)
    .map((key) => parseInt(key))
    .reverse();

  return keys.map((key) => ({ key, sketches: groupedSketches[key] }));
};

const TimeGroupedSketches = ({ sketches, mine }) => {
  const groups = groupSketches(sketches);

  return (
    <div className="flex flex-col flex-grow flex-shrink p-8 overflow-auto space-y-8">
      {!sketches && <Logo className="loading-spinner" />}
      {_.map(groups, ({ key, sketches }) => {
        return (
          <div key={key}>
            <h3 className="mb-2 text-lg">
              {_.capitalize(moment(sketches[0].updated_at).fromNow())}
            </h3>
            <div className="flex flex-row flex-wrap">
              {sketches?.map((sketch) => (
                <Link
                  key={sketch.id}
                  to={
                    mine ? `/my-patterns/${sketch.id}` : `/gallery/${sketch.id}`
                  }
                >
                  <Sketch className="mb-4 mr-4" sketch={sketch} width={32} />
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimeGroupedSketches;
