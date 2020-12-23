import { getToken } from "~/utils/auth";
import { url } from "~/utils/urls";

export const post = async (path, body = {}) => {
  const token = await getToken();
  return fetch(url(path), {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...body }),
  }).then((response) => response.json());
};

export const postDelete = async (path, body = {}) => {
  const token = await getToken();
  return fetch(url(path), {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...body }),
  });
};

export const put = async (path, body = {}) => {
  const token = await getToken();
  return fetch(url(path), {
    method: "PUT",
    headers: {
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
