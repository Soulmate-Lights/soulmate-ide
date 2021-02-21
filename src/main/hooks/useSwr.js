import normalizeUrl from "normalize-url";
import useSwr, { mutate as _mutate } from "swr";

import ConfigContainer from "~/containers/config";

import { headersAndCredentials } from "../utils/network";

export const fetcher = async (url) => {
  const headers = await headersAndCredentials();
  return fetch(url, { ...headers }).then((d) => d.json());
};

const useRequest = (path) => {
  if (!path) throw new Error("Path is required");

  const { appServer } = ConfigContainer.useContainer();
  const url = normalizeUrl(appServer + "/" + path);
  return useSwr(url, fetcher);
};

export default useRequest;

export const mutate = _mutate;
