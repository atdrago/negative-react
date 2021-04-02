import { BrowserWindow, ipcMain } from 'electron';

import {
  destroyBrowserWindow,
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
}: IViewBrowserWindowProps): BrowserWindow {
  const browserWindow = new BrowserWindow({
    ...defaultWindowOptions,
    ...{
      ...captureBounds,
      titleBarStyle: 'hiddenInset',
      x: displayBounds.x + captureBounds.x,
      y: displayBounds.y + captureBounds.y,
    },
  });

  browserWindow.on('closed', ({ sender }: IBrowserWindowEvent) => {
    destroyBrowserWindow(sender);
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
