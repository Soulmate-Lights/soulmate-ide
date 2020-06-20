const ElectronAuth0Login = require("electron-auth0-login").default;

const auth = new ElectronAuth0Login({
  auth0Audience: "https://yellow-boat-0900.auth0.com/api/v2/",
  auth0ClientId: "OsKmsunrgzhFv2znzUHpd9JsFSsOl46o",
  auth0Domain: "yellow-boat-0900.auth0.com",
  auth0Scopes: "openid profile offline_access",
  applicationName: "soulmate",
  useRefreshTokens: true,
});

module.exports = auth;
