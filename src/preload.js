window.ipcRenderer = require("electron").ipcRenderer;

var remote = require("electron").remote;
var electronFs = remote.require("fs");
window.fs = electronFs;

var electron = require("electron");
window.electron = electron;

const auth = remote.require("./auth");
window.auth = auth;
