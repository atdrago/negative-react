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
  title: 'Negative',
  transparent: true,
  webPreferences: {
    enableRemoteModule: true,
    preload: path.join(__dirname, 'window-preload.js'),
  },
};

module.exports = {
  _captureBrowserWindows: [],
  _viewBrowserWindow: [],

  _createCaptureBrowserWindows() {
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
        this._destroyCaptureBrowserWindow(evt.sender);
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

      this._captureBrowserWindows.push(browserWindow);
    });
  },

  _createViewBrowserWindow(imageUri, captureBounds, displayBounds) {
    const browserWindow = new BrowserWindow({
      ...defaultWindowOptions,
      ...{
        ...captureBounds,
        titleBarStyle: 'hiddenInset',
        x: displayBounds.x + captureBounds.x,
        y: displayBounds.y + captureBounds.y,
      },
    });

    browserWindow.on('closed', (evt) => {
      this._destroyViewBrowserWindow(evt.sender);
    });

    browserWindow.on('focus', () => {
      browserWindow.setWindowButtonVisibility(true);
    });

    browserWindow.on('blur', () => {
      browserWindow.setWindowButtonVisibility(false);
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

    this._viewBrowserWindows.push(browserWindow);
  },

  _destroyCaptureBrowserWindow(targetWindow) {
    this._captureBrowserWindows = this._captureBrowserWindows.reduce(
      (resultWindows, currentWindow) => {
        if (currentWindow === targetWindow) {
          currentWindow.destroy();
          return resultWindows;
        }

        return [...resultWindows, currentWindow];
      },
      [],
    );
  },

  _destroyCaptureBrowserWindows() {
    this._captureBrowserWindows = this._captureBrowserWindows.reduce(
      (resultWindows, currentWindow) => {
        currentWindow.destroy();

        return resultWindows;
      },
      [],
    );
  },

  _destroyViewBrowserWindow(targetWindow) {
    this._viewBrowserWindows = this._viewBrowserWindows.reduce(
      (resultWindows, currentWindow) => {
        if (currentWindow === targetWindow) {
          currentWindow.destroy();
          return resultWindows;
        }

        return [...resultWindows, currentWindow];
      },
      [],
    );
  },

  _hideCaptureBrowserWindows() {
    this._captureBrowserWindows.forEach((browserWindow) =>
      browserWindow.hide(),
    );
  },

  _hideViewBrowserWindows() {
    this._viewBrowserWindows.forEach((browserWindow) => browserWindow.hide());
  },
  _showOrCreateCaptureBrowserWindows() {
    if (this._captureBrowserWindows.length > 0) {
      this._captureBrowserWindows.forEach((browserWindow) =>
        browserWindow.show(),
      );
    } else {
      this._createCaptureBrowserWindows();
    }
  },
  _showViewBrowserWindows() {
    this._viewBrowserWindows.forEach((browserWindow) => browserWindow.show());
  },

  hideAllWindows() {
    this._hideViewBrowserWindows();
    this._hideCaptureBrowserWindows();
  },
  init(_menu) {
    this._menu = _menu;
    this.cachedIsInCaptureMode = false;
    this._captureBrowserWindows = [];
    this._viewBrowserWindows = [];

    return this;
  },
  isInCaptureMode() {
    return this.cachedIsInCaptureMode;
  },
  // rebuildCaptureWindows() {
  //   this._destroyCaptureBrowserWindows();

  //   // TODO: Recreate windows hidden if app is hidden
  //   this._createCaptureBrowserWindows();
  // },
  startCaptureMode() {
    this.cachedIsInCaptureMode = true;

    this._hideViewBrowserWindows();
    this._showOrCreateCaptureBrowserWindows();
    this._menu.createMenu();
  },
  startViewMode(imageUri, captureBounds, displayBounds) {
    this.cachedIsInCaptureMode = false;

    this._hideCaptureBrowserWindows();
    this._showViewBrowserWindows();
    if (imageUri && captureBounds && displayBounds) {
      this._createViewBrowserWindow(imageUri, captureBounds, displayBounds);
    }
    this._menu.createMenu();
  },
};
