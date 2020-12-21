import { getToken } from "~/utils/auth";
const server = "https://editor.soulmatelights.com";
// const server = "http://localhost:3001";

export const post = async (url, body = {}) => {
  const token = await getToken();
  return fetch(server + url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...body }),
  }).then((response) => response.json());
};

export const postDelete = async (url, body = {}) => {
  const token = await getToken();
  return fetch(server + url, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...body }),
  });
};

export const put = async (url, body = {}) => {
  const token = await getToken();
  return fetch(server + url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  }).then((response) => response.json());
};

export const fetcher = async (url) => {
  const token = await getToken();
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((d) => d.json());
};
