import path from 'path';
import url from 'url';

import { BrowserWindow, screen } from 'electron';

import { CaptureBrowserWindow } from 'main/components/CaptureBrowserWindow';
import { ViewBrowserWindow } from 'main/components/ViewBrowserWindow';
import { createMenu } from 'main/services/menu';
import { isPointInRectangle } from 'main/utils/isPointInRectangle';
import {
  WINDOW_TYPE,
  BrowserWindowWithState,
  IViewBrowserWindowState,
} from 'typings';

let cachedIsInCaptureMode = false;
let windowStore: BrowserWindowWithState[] = [];

export const defaultWindowOptions = {
  acceptFirstMouse: true,
  alwaysOnTop: true,
  enableLargerThanScreen: true,
  frame: false,
  hasShadow: false,
  title: 'Negative',
  transparent: true,
  webPreferences: {
    contextIsolation: false,
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

export function destroyBrowserWindow(targetWindow: BrowserWindow): void {
  windowStore = windowStore.filter(({ browserWindow }) => {
    if (browserWindow === targetWindow) {
      browserWindow.destroy();
    }

    return browserWindow !== targetWindow;
  });
}

export function destroyAllBrowserWindows(): void {
  windowStore.forEach(({ browserWindow }) => browserWindow.destroy());

  windowStore = [];
}

export function getBrowserWindowState(
  targetWindow: BrowserWindow,
): IViewBrowserWindowState | null | undefined {
  const windowWithState = windowStore.find(
    ({ browserWindow }) => targetWindow === browserWindow,
  );

  if (windowWithState) {
    return windowWithState.state;
  }
}

export function getBrowserWindowStatesUnderCursor(): BrowserWindowWithState[] {
  const cursorPoint = screen.getCursorScreenPoint();

  return windowStore.filter(({ browserWindow, type }) => {
    return (
      type === WINDOW_TYPE.VIEW &&
      isPointInRectangle(cursorPoint, browserWindow.getBounds())
    );
  });
}

export function hideAllBrowserWindows(): void {
  windowStore.forEach(({ browserWindow }) => browserWindow.hide());
}

export function isInCaptureMode(): boolean {
  return cachedIsInCaptureMode;
}

function renderCaptureBrowserWindows(): void {
  const displays = screen.getAllDisplays();

  windowStore = [
    ...windowStore,
    ...displays.map((display) => {
      const browserWindowWithState: BrowserWindowWithState = {
        browserWindow: CaptureBrowserWindow({ display }),
        state: null,
        type: WINDOW_TYPE.CAPTURE,
      };

      return browserWindowWithState;
    }),
  ];
}

function renderViewBrowserWindow(
  imageUri: string,
  captureBounds: Electron.Rectangle,
  displayBounds: Electron.Rectangle,
): void {
  windowStore = [
    ...windowStore,
    {
      browserWindow: ViewBrowserWindow({
        imageUri,
        captureBounds,
        displayBounds,
      }),
      state: { isLocked: false },
      type: WINDOW_TYPE.VIEW,
    },
  ];
}

export function setBrowserWindowState(
  targetWindow: BrowserWindow,
  state: IViewBrowserWindowState,
): void {
  const windowWithState = windowStore.find(
    ({ browserWindow }) => targetWindow === browserWindow,
  );

  if (windowWithState) {
    windowWithState.state = state;

    windowWithState.browserWindow.webContents.send('state-change', state);
  }
}

export function setViewBrowserWindowIsLocked(
  targetWindow: BrowserWindow,
  isLocked: boolean,
): void {
  const windowWithState = windowStore.find(
    ({ browserWindow }) => targetWindow === browserWindow,
  );

  if (windowWithState) {
    windowWithState.browserWindow.setIgnoreMouseEvents(isLocked);
    setBrowserWindowState(targetWindow, {
      ...windowWithState.state,
      isLocked,
    });
  }
}

function showOrCreateCaptureBrowserWindows(): void {
  const captureBrowserWindows = windowStore.filter(
    ({ type }) => type === WINDOW_TYPE.CAPTURE,
  );

  if (captureBrowserWindows.length > 0) {
    captureBrowserWindows.forEach(({ browserWindow }) => browserWindow.show());
  } else {
    renderCaptureBrowserWindows();
  }
}

function showViewBrowserWindows(): void {
  windowStore.forEach(({ browserWindow, type }) => {
    if (type === WINDOW_TYPE.VIEW) {
      browserWindow.show();
    }
  });
}

export function startCaptureMode(): void {
  cachedIsInCaptureMode = true;

  hideAllBrowserWindows();
  showOrCreateCaptureBrowserWindows();
  createMenu();
}

export function startViewMode(
  imageUri?: string,
  captureBounds?: Electron.Rectangle,
  displayBounds?: Electron.Rectangle,
): void {
  cachedIsInCaptureMode = false;

  hideAllBrowserWindows();
  showViewBrowserWindows();
  if (imageUri && captureBounds && displayBounds) {
    renderViewBrowserWindow(imageUri, captureBounds, displayBounds);
  }
  createMenu();
}

// rebuildCaptureWindows() {
//   this._destroyCaptureBrowserWindows();

//   // TODO: Recreate windows hidden if app is hidden
//   renderCaptureBrowserWindows();
// },
