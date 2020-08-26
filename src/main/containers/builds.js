import { createContainer } from "unstated-next";
import { buildHex } from "~/utils/compiler/compile";
import { preparePreviewCode } from "~/utils/code";

function Builds() {
  let [builds, setBuilds] = useState({});
  let [building, setBuilding] = useState({});

  function getBuild(code, rows, cols) {
    const key = JSON.stringify({ code, rows, cols });

    if (building[key]) return false;

    if (builds[key]) return builds[key];

    const preparedCode = preparePreviewCode(code, rows, cols);
    setBuilding({ ...building, [key]: true });
    buildHex(preparedCode).then((build) => {
      setBuilds({ ...builds, [key]: build });
      setBuilding({ ...building, [key]: false });
    });
    return false;
  }

  return { getBuild };
}

export default createContainer(Builds);
