window.ipcRenderer = require("electron").ipcRenderer;

const remote = require("electron").remote;
window.remote = remote;

const electronFs = remote.require("fs");
window.fs = electronFs;

const electron = require("electron");
window.electron = electron;

window.isDev = require("electron-is-dev");

window.childProcess = remote.require("child_process");
