import path from 'path';
import url from 'url';

import { BrowserWindow, screen } from 'electron';

import { CaptureBrowserWindow } from 'main/components/CaptureBrowserWindow';
import { ViewBrowserWindow } from 'main/components/ViewBrowserWindow';
import { createMenu } from 'main/services/menu';
import { WINDOW_TYPE } from 'typings';

export const defaultWindowOptions = {
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

export const WINDOW_BASE_URL =
  MAIN_WINDOW_WEBPACK_ENTRY ||
  process.env.ELECTRON_START_URL ||
  url.format({
    pathname: path.join(
      __dirname,
      '/../../.webpack/renderer/main_window/index.html',
    ),
    protocol: 'file:',
    slashes: true,
  });

const windowStore: { [TKey in WINDOW_TYPE]: BrowserWindow[] } = {
  [WINDOW_TYPE.CAPTURE]: [],
  [WINDOW_TYPE.VIEW]: [],
};

let cachedIsInCaptureMode = false;

function renderCaptureBrowserWindows(): void {
  const displays = screen.getAllDisplays();

  // We want to create a new window for each display
  windowStore[WINDOW_TYPE.CAPTURE] = [
    ...windowStore[WINDOW_TYPE.CAPTURE],
    ...displays.map((display) => {
      return CaptureBrowserWindow({ display });
    }),
  ];
}

function renderViewBrowserWindow(
  imageUri: string,
  captureBounds: Electron.Rectangle,
  displayBounds: Electron.Rectangle,
): void {
  // We want to create a new window for each display
  windowStore[WINDOW_TYPE.VIEW] = [
    ...windowStore[WINDOW_TYPE.VIEW],
    ViewBrowserWindow({ imageUri, captureBounds, displayBounds }),
  ];
}

export function destroyCaptureBrowserWindow(targetWindow: BrowserWindow): void {
  windowStore[WINDOW_TYPE.CAPTURE] = windowStore[WINDOW_TYPE.CAPTURE].reduce(
    (resultWindows, currentWindow) => {
      if (currentWindow === targetWindow) {
        currentWindow.destroy();
        return resultWindows;
      }

      return [...resultWindows, currentWindow];
    },
    [] as BrowserWindow[],
  );
}

function destroyCaptureBrowserWindows(): void {
  windowStore[WINDOW_TYPE.CAPTURE] = windowStore[WINDOW_TYPE.CAPTURE].reduce(
    (resultWindows, currentWindow) => {
      currentWindow.destroy();

      return resultWindows;
    },
    [] as never[],
  );
}

export function destroyViewBrowserWindow(targetWindow: BrowserWindow): void {
  windowStore[WINDOW_TYPE.VIEW] = windowStore[WINDOW_TYPE.VIEW].reduce(
    (resultWindows, currentWindow) => {
      if (currentWindow === targetWindow) {
        currentWindow.destroy();
        return resultWindows;
      }

      return [...resultWindows, currentWindow];
    },
    [] as BrowserWindow[],
  );
}

function destroyViewBrowserWindows(): void {
  windowStore[WINDOW_TYPE.VIEW] = windowStore[WINDOW_TYPE.VIEW].reduce(
    (resultWindows, currentWindow) => {
      currentWindow.destroy();

      return resultWindows;
    },
    [] as never[],
  );
}

function hideCaptureBrowserWindows(): void {
  windowStore[WINDOW_TYPE.CAPTURE].forEach((browserWindow) =>
    browserWindow.hide(),
  );
}

function hideViewBrowserWindows(): void {
  windowStore[WINDOW_TYPE.VIEW].forEach((browserWindow) =>
    browserWindow.hide(),
  );
}

function showOrCreateCaptureBrowserWindows(): void {
  if (windowStore[WINDOW_TYPE.CAPTURE].length > 0) {
    windowStore[WINDOW_TYPE.CAPTURE].forEach((browserWindow) =>
      browserWindow.show(),
    );
  } else {
    renderCaptureBrowserWindows();
  }
}

function showViewBrowserWindows(): void {
  windowStore[WINDOW_TYPE.VIEW].forEach((browserWindow) =>
    browserWindow.show(),
  );
}

export function destroyAllWindows(): void {
  destroyViewBrowserWindows();
  destroyCaptureBrowserWindows();
}

export const hideAllWindows = (): void => {
  hideViewBrowserWindows();
  hideCaptureBrowserWindows();
};

export const isInCaptureMode = (): boolean => {
  return cachedIsInCaptureMode;
};

export const startCaptureMode = (): void => {
  cachedIsInCaptureMode = true;

  hideViewBrowserWindows();
  showOrCreateCaptureBrowserWindows();
  createMenu();
};

export const startViewMode = (
  imageUri?: string,
  captureBounds?: Electron.Rectangle,
  displayBounds?: Electron.Rectangle,
): void => {
  cachedIsInCaptureMode = false;

  hideCaptureBrowserWindows();
  showViewBrowserWindows();
  if (imageUri && captureBounds && displayBounds) {
    renderViewBrowserWindow(imageUri, captureBounds, displayBounds);
  }
  createMenu();
};

// rebuildCaptureWindows() {
//   this._destroyCaptureBrowserWindows();

//   // TODO: Recreate windows hidden if app is hidden
//   renderCaptureBrowserWindows();
// },
