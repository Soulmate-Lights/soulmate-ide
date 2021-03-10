import useSWR from "~/hooks/useSwr";

const useSavedFirmware = (soulmate) => {
  const buildId = soulmate?.config?.build;
  const fetcher = (url) => fetch(url).then((d) => d.json());
  const path = buildId ? `builds/${buildId}` : null;
  const { data } = useSWR(path, fetcher);
  return data;
};

export default useSavedFirmware;
