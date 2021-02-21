import { useContainer } from "unstated-next";

import BuildsContainer from "~/containers/builds";
import ConfigContainer from "~/containers/config";
import { buildHex, preparePreviewCode } from "~/utils/code";

const useBuild = (code, config) => {
  const { simulator } = useContainer(ConfigContainer);
  const { getBuild, setBuild, isBuilding, setIsBuilding } = useContainer(
    BuildsContainer
  );

  const [buildingState, setBuildingState] = useState(false);

  const cachedBuild = getBuild(code, config);

  useEffect(() => {
    if (cachedBuild) return;

    setBuildingState(true);
    setIsBuilding(code, config, true);

    if (isBuilding(code, config)) return;
    if (buildingState) return;

    const preparedCode = preparePreviewCode(code, config);

    buildHex(preparedCode, simulator)
      .then((build) => {
        setIsBuilding(code, config, false);
        setBuild(code, config, build);
        setBuildingState(false);
      })
      .catch(() => setIsBuilding(code, config, false));

    return () => {};
  }, [code, config, cachedBuild]);

  return cachedBuild;
};

export default useBuild;
