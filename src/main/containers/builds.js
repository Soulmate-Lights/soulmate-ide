import { createContainer } from "~/utils/unstated-next";

const makeKey = (code, config) => JSON.stringify({ code, config });

function Builds() {
  let [_builds, _setBuilds] = useState({});
  let [_building, _setBuilding] = useState({});

  function getBuild(code, config) {
    const key = makeKey(code, config);

    return _builds[key];
  }

  function setBuild(code, config, build) {
    const key = makeKey(code, config);

    _setBuilding({ ..._building, [key]: false });
    _setBuilds({ ..._builds, [key]: build });
  }

  function isBuilding(code, config) {
    const key = makeKey(code, config);

    return _building[key];
  }

  function setIsBuilding(code, config, building) {
    const key = makeKey(code, config);

    _setBuilding({ ..._building, [key]: building });
  }

  return { getBuild, setBuild, isBuilding, setIsBuilding };
}

export default createContainer(Builds);
