import path from 'path';
import url from 'url';

import { BrowserWindow, ipcMain } from 'electron';

import {
  destroyViewBrowserWindow,
  defaultWindowOptions,
} from 'main/services/window';
import {
  IBrowserWindowEvent,
  IViewBrowserWindowProps,
  WINDOW_TYPE,
} from 'typings';

export function ViewBrowserWindow({
  imageUri,
  captureBounds,
  displayBounds,
}: IViewBrowserWindowProps) {
  const browserWindow = new BrowserWindow({
    ...defaultWindowOptions,
    ...{
      ...captureBounds,
      titleBarStyle: 'hiddenInset',
      x: displayBounds.x + captureBounds.x,
      y: displayBounds.y + captureBounds.y,
    },
  });

  browserWindow.on('closed', (event: IBrowserWindowEvent) => {
    destroyViewBrowserWindow(event.sender);
  });

  browserWindow.on('focus', () => {
    browserWindow.setWindowButtonVisibility(true);
  });

  browserWindow.on('blur', () => {
    browserWindow.setWindowButtonVisibility(false);
  });

  const windowUrl = MAIN_WINDOW_WEBPACK_ENTRY
    ? `${MAIN_WINDOW_WEBPACK_ENTRY}?type=${WINDOW_TYPE.VIEW}`
    : process.env.ELECTRON_START_URL
    ? `${process.env.ELECTRON_START_URL}?type=${WINDOW_TYPE.VIEW}`
    : url.format({
        pathname: path.join(
          __dirname,
          `/../../.webpack/renderer/main_window/index.html?type=${WINDOW_TYPE.VIEW}`,
        ),
        protocol: 'file:',
        slashes: true,
      });

  browserWindow.loadURL(windowUrl);

  ipcMain.handleOnce('view-mount', () => {
    ipcMain.removeHandler('view-mount');
    browserWindow.webContents.send(
      'capture-complete',
      imageUri,
      captureBounds,
      displayBounds,
    );
  });

  return browserWindow;
}
