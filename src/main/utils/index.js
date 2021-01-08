import { getToken } from "~/utils/auth";
import { url } from "~/utils/urls";

export const post = async (path, body = {}) => {
  return fetch(url(path), {
    method: "post",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body }),
  }).then((response) => response.json());
};

export const postDelete = async (path, body = {}) => {
  return fetch(url(path), {
    method: "delete",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body }),
  });
};

export const put = async (path, body = {}) => {
  return fetch(url(path), {
    credentials: "include",
    method: "PUT",
    body,
  }).then((response) => response.json());
};

export const fetcher = async (path) => {
  return fetch(path, {
    credentials: "include",
  }).then((d) => d.json());
};

export const get = async (path, params) => {
  const token = await getToken();
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  return fetch(url(path) + "?" + new URLSearchParams(params), {
    credentials: "include",
    headers,
  }).then((d) => d.json());
};

export const postWithToken = async (path, params) => {
  const token = await getToken();
  const headers = {
    "Content-Type": "application/json",
  };
  console.log(token);
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  } else {
    console.log("No token");
    debugger;
  }
  return fetch(url(path), {
    credentials: "include",
    method: "post",
    headers,
    body: JSON.stringify({ ...params, token }),
  }).then((d) => d.json());
};
