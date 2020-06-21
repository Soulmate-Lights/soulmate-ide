// const server = "https://editor.soulmatelights.com";
const server = "http://localhost:3001";

export const fetchJson = (url, token) => {
  let headers = {};
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }
  return fetch(server + url, {
    headers,
  }).then((result) => result.json());
};

export const post = (url, token, body = {}) => {
  return fetch(server + url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...body }),
  }).then((response) => response.json());
};

export const postDelete = (url, token, body = {}) => {
  return fetch(server + url, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...body }),
  }).then((response) => response.json());
};
