/* eslint-disable @typescript-eslint/no-var-requires */

const { desktopCapturer, ipcRenderer } = require('electron');
const { screen } = require('@electron/remote');

window.desktopCapturer = desktopCapturer;
window.ipcRenderer = ipcRenderer;
window.remoteScreen = screen;
