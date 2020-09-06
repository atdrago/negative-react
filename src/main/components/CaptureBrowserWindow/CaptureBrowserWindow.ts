import path from 'path';
import url from 'url';

import { BrowserWindow } from 'electron';

import {
  destroyCaptureBrowserWindow,
  defaultWindowOptions,
} from 'main/services/window';
import {
  IBrowserWindowEvent,
  ICaptureBrowserWindowProps,
  WINDOW_TYPE,
} from 'typings';

export function CaptureBrowserWindow({
  display,
}: ICaptureBrowserWindowProps): BrowserWindow {
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

  /**
   * Electron has this typed incorrectly
   */
  browserWindow.on('closed', ({ sender }: IBrowserWindowEvent) => {
    destroyCaptureBrowserWindow(sender);
  });

  const windowUrl = MAIN_WINDOW_WEBPACK_ENTRY
    ? `${MAIN_WINDOW_WEBPACK_ENTRY}?type=${WINDOW_TYPE.CAPTURE}`
    : process.env.ELECTRON_START_URL
    ? `${process.env.ELECTRON_START_URL}?type=${WINDOW_TYPE.CAPTURE}`
    : url.format({
        pathname: path.join(
          __dirname,
          `/../../.webpack/renderer/main_window/index.html?type=${WINDOW_TYPE.CAPTURE}`,
        ),
        protocol: 'file:',
        slashes: true,
      });

  browserWindow.loadURL(windowUrl);

  return browserWindow;
}
