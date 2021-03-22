import _ from "lodash";
import sortBy from "lodash/sortBy";
import moment from "moment";
import { Link } from "react-router-dom";

import Sketch from "~/components/sketch";
import Logo from "~/images/logo.svg";

import { sketchUrl } from "../utils/urlHelpers";

const groupSketches = (sketches) => {
  const monthName = (item) =>
    parseInt(moment(item.updated_at, "YYYY-MM-DD").format("YMMDD"));
  const groupedSketches = _.groupBy(sketches, monthName);
  const keys = Object.keys(groupedSketches)
    .map((key) => parseInt(key))
    .reverse();

  return keys.map((key) => ({ key, sketches: groupedSketches[key] }));
};

const TimeGroupedSketches = ({ sketches, onClick }) => {
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
              {sortBy(sketches, (s) => s.updated_at).map((sketch) => {
                let path = sketchUrl(sketch);

                if (onClick) path = false;
                return (
                  <Link
                    key={sketch.id}
                    onClick={() => onClick && onClick(sketch)}
                    to={path}
                  >
                    <Sketch
                      className="w-24 h-24 m-1 md:mb-4 md:mr-4"
                      sketch={sketch}
                      width={144}
                    />
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TimeGroupedSketches;
