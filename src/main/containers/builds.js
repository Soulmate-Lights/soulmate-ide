import { createContainer } from "unstated-next";

function Builds() {
  let [_builds, _setBuilds] = useState({});
  let [_building, _setBuilding] = useState({});

  function getBuild(code, config) {
    const key = JSON.stringify({ code, config });
    if (_building[key]) return false;
    if (_builds[key]) return _builds[key];
    return false;
  }

  function setBuild(code, config, build) {
    const key = JSON.stringify({ code, config });
    _setBuilds({ ..._builds, [key]: build });
    _setBuilding({ ..._building, [key]: false });
  }

  function isBuilding(code, config) {
    const key = JSON.stringify({ code, config });
    return _building[key];
  }

  function setIsBuilding(code, config, building) {
    const key = JSON.stringify({ code, config });
    _setBuilds({ ..._builds, [key]: false });
    _setBuilding({ ..._building, [key]: building });
  }

  return { getBuild, setBuild, isBuilding, setIsBuilding };
}

export default createContainer(Builds);
