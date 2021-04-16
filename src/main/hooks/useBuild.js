import ReactGA from "react-ga";

import BuildsContainer from "~/containers/builds";
import NetworkContainer from "~/containers/network";
import { buildHex } from "~/utils/code";

const useBuild = (code, config) => {
  const { simulator } = NetworkContainer.useContainer();
  const {
    getBuild,
    setBuild,
    isBuilding,
    setIsBuilding,
  } = BuildsContainer.useContainer();

  useEffect(() => {
    if (getBuild(code, config) || isBuilding(code, config)) return;

    setIsBuilding(code, config, true);

    ReactGA.event({
      category: "Emulator",
      action: "Emulator build"
    });

    let t = new Date();
    buildHex(code, config, simulator).then((build) => {
      ReactGA.timing({
        category: 'Emulator',
        variable: 'build',
        value: new Date() - t,
        label: 'Emulator build time'
      });
      setBuild(code, config, build);
    });
  }, [code, config, simulator]);

  return getBuild(code, config);
};

export default useBuild;
