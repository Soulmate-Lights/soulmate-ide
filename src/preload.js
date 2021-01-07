window.ipcRenderer = require("electron").ipcRenderer;

const remote = require("electron").remote;
window.remote = remote;

const electronFs = remote.require("fs");
window.fs = electronFs;

const electron = require("electron");
window.electron = electron;

// const auth = remote.require("./auth");
// window.auth = auth;
