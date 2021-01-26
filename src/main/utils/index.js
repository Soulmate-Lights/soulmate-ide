import { url } from "~/utils/urls";

import { auth0Promise } from "./auth";

const headersAndCredentials = async () => {
  const auth = await auth0Promise;
  const authenticated = await auth.isAuthenticated();
  const headers = { "Content-Type": "application/json" };
  if (authenticated) headers["Authorization"] = await auth.getTokenSilently();
  return {
    headers: headers,
    credentials: "include",
  };
};

export const post = async (path, body = {}) => {
  return fetch(url(path), {
    method: "post",
    ...(await headersAndCredentials()),
    body: JSON.stringify({ ...body }),
  }).then((d) => d.json());
};

export const postDelete = async (path, body = {}) => {
  return fetch(url(path), {
    method: "delete",
    ...(await headersAndCredentials()),
    body: JSON.stringify({ ...body }),
  }).then((d) => d.json());
};

export const put = async (path, body = {}) => {
  const auth = await auth0Promise;
  const authenticated = await auth.isAuthenticated();
  const headers = {};
  if (authenticated) headers["Authorization"] = await auth.getTokenSilently();
  return fetch(url(path), {
    method: "PUT",
    credentials: "include",
    body,
  }).then((d) => d.json());
};

export const fetcher = async (path) => {
  return fetch(url(path), {
    ...(await headersAndCredentials()),
  }).then((d) => d.json());
};

export const get = async (path, params) => {
  return fetch(url(path) + "?" + new URLSearchParams(params), {
    ...(await headersAndCredentials()),
  }).then((d) => d.json());
};

export const postWithToken = async (path, params) => {
  return fetch(url(path), {
    method: "post",
    ...(await headersAndCredentials()),
    body: JSON.stringify({ ...params }),
  }).then((d) => d.json());
};
