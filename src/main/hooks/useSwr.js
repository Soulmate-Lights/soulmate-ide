import normalizeUrl from "normalize-url";
import useSwr from "swr";

import NetworkContainer from "~/containers/network";

import { headersAndCredentials } from "../utils/network";

export const fetcher = async (url) => {
  const headers = await headersAndCredentials();
  return fetch(url, { ...headers }).then((d) => d.json());
};

const useRequest = (path, fetchFunction = fetcher) => {
  const { appServer } = NetworkContainer.useContainer();
  const url = path ? normalizeUrl(appServer + "/" + path) : path;
  return useSwr(url, fetchFunction);
};

export default useRequest;
