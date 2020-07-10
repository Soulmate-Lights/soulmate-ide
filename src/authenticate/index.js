const server = "http://localhost:3001/auth";

export const signup = async ({ name, email, password }) => {
  var d = new FormData();
  d.append("email", email);
  d.append("name", name);
  d.append("password", password);
  d.append("password_confirmation", password);

  const response = await fetch(server, {
    method: "POST",
    body: d,
  });

  const json = await response.json();
  const user = json.data;

  const accessToken = response.headers.get("access-token");
  const client = response.headers.get("client");
  const uid = user.uid;

  save({ user, accessToken, client, uid });

  return user;
};

export const login = async (email, password) => {
  var d = new FormData();
  d.append("email", email);
  d.append("password", password);
  const response = await fetch(server + "/sign_in", {
    method: "POST",
    body: d,
  });
  const accessToken = response.headers.get("access-token");
  const client = response.headers.get("client");
  const user = await response.json();
  const uid = user.data.uid;
  const authData = { user, accessToken, client, uid };
  save(authData);
  return user.data;
};

const save = (authData) => {
  localStorage.setItem("authData", JSON.stringify(authData));
};

export const authenticationHeaders = async () => {
  let headers = {};
  if (!localStorage.authData) return {};
  const authData = JSON.parse(localStorage.authData);
  if (authData) {
    headers = {
      ...headers,
      "access-token": authData.accessToken,
      "token-type": "Bearer",
      client: authData.client,
      uid: authData.uid,
    };
  }
  return headers;
};

export const loggedIn = async () => {
  const data = localStorage.getItem("authData");
  if (!data) return false;
  return true;
};

export const autoLogin = async () => {
  const data = localStorage.getItem("authData");
  if (!data) return false;
  const authData = JSON.parse(data);
  const updatedData = await validate(
    authData.accessToken,
    authData.client,
    authData.uid
  );
  return updatedData.user;
};

export const validate = async (token, client, uid) => {
  const params = {
    "access-token": token,
    uid,
    client,
  };
  let url = new URL(server + "/validate_token");
  url.search = new URLSearchParams(params).toString();
  const response = await fetch(url);
  const json = await response.json();

  return {
    user: json.data,
    accessToken: response.headers.get("access-token"),
    uid: json.data.uid,
    client: response.headers.get("client"),
  };
};

export const logout = () => {
  localStorage.clear();
};
