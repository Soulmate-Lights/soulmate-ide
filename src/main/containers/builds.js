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
    _setBuilding({ ..._building, [key]: false });
    _setBuilds({ ..._builds, [key]: build });
  }

  function isBuilding(code, config) {
    const key = JSON.stringify({ code, config });
    // console.log(_building[key] ? "Building" : "Not building");
    return _building[key];
  }

  function setIsBuilding(code, config, building) {
    const key = JSON.stringify({ code, config });
    // console.log(building ? "Start building" : "Stop building");
    _setBuilding({ ..._building, [key]: building });
    // _setBuilds({ ..._builds, [key]: false });
  }

  return { getBuild, setBuild, isBuilding, setIsBuilding };
}

export default createContainer(Builds);
