import ReactGA from "react-ga";

import NetworkContainer from "~/containers/network";
import { buildHex } from "~/utils/code";

const useBuild = (code, config) => {
  const { simulator } = NetworkContainer.useContainer();
  const [build, setBuild] = useState();

  useEffect(() => {
    setBuild(undefined);

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
      setBuild(build);
      // setIsBuilding(false);
    });
  }, [code, config, simulator]);

  return build;
};

export default useBuild;
