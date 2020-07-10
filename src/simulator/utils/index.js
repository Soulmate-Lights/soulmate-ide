// const server = "https://editor.soulmatelights.com";
const server = "http://localhost:3001";

import { authenticationHeaders } from "../../authenticate";

const getHeaders = async () => {
  const extraHeaders = await authenticationHeaders();
  return {
    "Content-Type": "application/json",
    ...extraHeaders,
  };
};

export const fetchJson = async (url) => {
  const headers = await getHeaders();
  return fetch(server + url, {
    headers,
  }).then((result) => result.json());
};

export const post = async (url, body = {}) => {
  const headers = await getHeaders();
  return fetch(server + url, {
    method: "post",
    headers,
    body: JSON.stringify({ ...body }),
  }).then((response) => response.json());
};

export const postDelete = async (url, body = {}) => {
  const headers = await getHeaders();
  return fetch(server + url, {
    method: "delete",
    headers,
    body: JSON.stringify({ ...body }),
  }).then((response) => response.json());
};
