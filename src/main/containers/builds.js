import { createContainer } from "unstated-next";

function Builds() {
  let [builds, setBuilds] = useState({});
  let [_building, _setBuilding] = useState({});

  function getBuild(code, config) {
    const key = JSON.stringify({ code, config });
    if (_building[key]) return false;
    if (builds[key]) return builds[key];
    return false;
  }

  function isBuilding(code, config) {
    const key = JSON.stringify({ code, config });
    return _building[key];
  }

  function setBuilding(code, config, building) {
    const key = JSON.stringify({ code, config });
    setBuilds({ ...builds, [key]: false });
    _setBuilding({ ..._building, [key]: building });
  }

  function setBuild(code, config, build) {
    const key = JSON.stringify({ code, config });
    setBuilds({ ...builds, [key]: build });
    _setBuilding({ ..._building, [key]: false });
  }

  return { getBuild, setBuild, isBuilding, builds, setBuilds, setBuilding };
}

export default createContainer(Builds);
