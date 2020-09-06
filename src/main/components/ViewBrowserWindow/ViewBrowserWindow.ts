import path from 'path';
import url from 'url';

import { BrowserWindow, ipcMain } from 'electron';

import {
  destroyViewBrowserWindow,
  defaultWindowOptions,
  WINDOW_BASE_URL,
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

  browserWindow.loadURL(`${WINDOW_BASE_URL}?type=${WINDOW_TYPE.VIEW}`);

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
