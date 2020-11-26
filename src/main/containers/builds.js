import { createContainer } from "unstated-next";

import { buildHex, preparePreviewCode } from "~/utils/code";

function Builds() {
  let [builds, setBuilds] = useState({});
  let [building, setBuilding] = useState({});

  function getBuild(code, config) {
    const key = JSON.stringify({ code, config });

    if (building[key]) return false;
    if (builds[key]) return builds[key];

    setTimeout(() => {
      const preparedCode = preparePreviewCode(code, config);
      setBuilding({ ...building, [key]: true });
      buildHex(preparedCode).then((build) => {
        setBuilds({ ...builds, [key]: build });
        setBuilding({ ...building, [key]: false });
      });
    });
    return false;
  }

  return { getBuild };
}

export default createContainer(Builds);
