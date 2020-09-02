const path = require('path');
const url = require('url');

const { BrowserWindow, screen, ipcMain } = require('electron');

const WINDOW_TYPE = {
  CAPTURE: 'CAPTURE',
  VIEW: 'VIEW',
};

const defaultWindowOptions = {
  acceptFirstMouse: true,
  alwaysOnTop: true,
  enableLargerThanScreen: true,
  frame: false,
  hasShadow: false,
  transparent: true,
  webPreferences: {
    enableRemoteModule: true,
    preload: path.join(__dirname, 'window-preload.js'),
  },
};

/**
 * @type {BrowserWindow[]}
 */
let captureBrowserWindows = [];

function createCaptureBrowserWindows() {
  const displays = screen.getAllDisplays();

  // We want to create a new window for each display
  displays.forEach((display) => {
    const {
      bounds: { x, y },
      size: { height, width },
    } = display;

    const browserWindow = new BrowserWindow({
      ...defaultWindowOptions,
      ...{
        closable: false,
        fullscreenable: false,
        height,
        maximizable: false,
        minimizable: false,
        movable: false,
        resizable: false,
        width,
        x,
        y,
      },
    });

    browserWindow.setAlwaysOnTop(true, 'screen-saver');

    browserWindow.on('closed', (evt) => {
      destroyCaptureWindow(evt.sender);
    });

    browserWindow.loadURL(
      `${process.env.ELECTRON_START_URL}?type=${WINDOW_TYPE.CAPTURE}` ||
        url.format({
          pathname: path.join(
            __dirname,
            `/../build/index.html?type=${WINDOW_TYPE.CAPTURE}`,
          ),
          protocol: 'file:',
          slashes: true,
        }),
    );

    captureBrowserWindows.push(browserWindow);
  });
}

function showOrCreateCaptureBrowserWindows() {
  if (captureBrowserWindows.length > 0) {
    captureBrowserWindows.forEach((browserWindow) => browserWindow.show());
  } else {
    createCaptureBrowserWindows();
  }
}

function hideCaptureBrowserWindows() {
  if (captureBrowserWindows.length > 0) {
    captureBrowserWindows.forEach((browserWindow) => browserWindow.hide());
  }
}

/**
 * @type {BrowserWindow[]}
 */
let viewBrowserWindows = [];

function createViewBrowserWindow(imageUri, captureBounds, displayBounds) {
  const browserWindow = new BrowserWindow({
    ...defaultWindowOptions,
    ...{
      ...captureBounds,
      titleBarStyle: 'hidden',
      x: displayBounds.x + captureBounds.x,
      y: displayBounds.y + captureBounds.y,
    },
  });

  browserWindow.on('closed', (evt) => {
    destroyViewWindow(evt.sender);
  });

  browserWindow.loadURL(
    `${process.env.ELECTRON_START_URL}?type=${WINDOW_TYPE.VIEW}` ||
      url.format({
        pathname: path.join(
          __dirname,
          `/../build/index.html?type=${WINDOW_TYPE.VIEW}`,
        ),
        protocol: 'file:',
        slashes: true,
      }),
  );

  ipcMain.handleOnce('view-mount', () => {
    ipcMain.removeHandler('view-mount');
    browserWindow.webContents.send(
      'capture-complete',
      imageUri,
      captureBounds,
      displayBounds,
    );
  });

  viewBrowserWindows.push(browserWindow);
}

function showViewBrowserWindows() {
  viewBrowserWindows.forEach((browserWindow) => browserWindow.show());
}

function hideViewBrowserWindows() {
  if (viewBrowserWindows.length > 0) {
    viewBrowserWindows.forEach((browserWindow) => browserWindow.hide());
  }
}

// function destroyAllWindows() {
//   captureBrowserWindows.forEach((targetWindow) => targetWindow.close());
//   viewBrowserWindows.forEach((targetWindow) => targetWindow.close());
// }

function destroyCaptureWindow(targetWindow) {
  captureBrowserWindows = captureBrowserWindows.filter(
    (currentWindow) => currentWindow !== targetWindow,
  );
}

function destroyViewWindow(targetWindow) {
  viewBrowserWindows = viewBrowserWindows.filter(
    (currentWindow) => currentWindow !== targetWindow,
  );
}

module.exports = {
  init(_menu) {
    this._menu = _menu;
    this.cachedIsInCaptureMode = false;

    return this;
  },
  isInCaptureMode() {
    return this.cachedIsInCaptureMode;
  },
  startCaptureMode() {
    this.cachedIsInCaptureMode = true;

    hideViewBrowserWindows();
    showOrCreateCaptureBrowserWindows();
    this._menu.createMenu();
  },
  startViewMode(imageUri, captureBounds, displayBounds) {
    this.cachedIsInCaptureMode = false;

    hideCaptureBrowserWindows();
    showViewBrowserWindows();
    if (imageUri && captureBounds && displayBounds) {
      createViewBrowserWindow(imageUri, captureBounds, displayBounds);
    }
    this._menu.createMenu();
  },
};