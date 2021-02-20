import { useContainer } from "unstated-next";

import BuildsContainer from "~/containers/builds";
import ConfigContainer from "~/containers/config";
import { buildHex, preparePreviewCode } from "~/utils/code";

const useBuild = (code, config) => {
  const { simulator } = useContainer(ConfigContainer);
  const { getBuild, setBuild, isBuilding, setBuilding } = useContainer(
    BuildsContainer
  );

  if (isBuilding(code, config)) return;

  const cachedBuild = getBuild(code, config);
  if (cachedBuild) return cachedBuild;

  setTimeout(() => {
    setBuilding(code, config, true);
    const preparedCode = preparePreviewCode(code, config);

    buildHex(preparedCode, simulator)
      .then((build) => setBuild(code, config, build))
      .catch(() => setBuilding(code, config, false));
  });

  return;
};

export default useBuild;
