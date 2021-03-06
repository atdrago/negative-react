import { BrowserWindow } from 'electron';

import {
  defaultWindowOptions,
  destroyBrowserWindow,
  WINDOW_BASE_URL,
} from 'main/services/window';
import {
  IBrowserWindowEvent,
  ICaptureBrowserWindowProps,
  WindowType,
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

  browserWindow.on('closed', ({ sender }: IBrowserWindowEvent) => {
    destroyBrowserWindow(sender);
  });

  browserWindow.loadURL(`${WINDOW_BASE_URL}?type=${WindowType.Capture}`);

  return browserWindow;
}
