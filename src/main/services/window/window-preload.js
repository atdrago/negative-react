// eslint-disable-next-line @typescript-eslint/no-var-requires
const { desktopCapturer, ipcRenderer, remote } = require('electron');
window.desktopCapturer = desktopCapturer;
window.ipcRenderer = ipcRenderer;
window.remote = remote;
