export const token = () => false; // document.querySelector("[name=csrf-token]").content;

export const fetchJson = (url) =>
  fetch("http://editor.soulmatelights.com/sketches/list").then((result) => result.json());

export const post = (url, body = {}) => {
  return fetch(url, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, authenticity_token: token() }),
  }).then((response) => response.json());
};

export const postDelete = (url, body = {}) => {
  return fetch(url, {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, authenticity_token: token() }),
  }).then((response) => response.json());
};
