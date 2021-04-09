import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';

import {
  destroyAllBrowserWindows,
  getBrowserWindowState,
  getBrowserWindowStatesUnderCursor,
  hideAllBrowserWindows,
  setViewBrowserWindowIsLocked,
  isInCaptureMode,
  startCaptureMode,
  startViewMode,
} from 'main/services/window';
import { IpcEvent } from 'typings';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

export const init = (): void => {
  app.whenReady().then(() => {
    startCaptureMode();

    ipcMain.handle(
      IpcEvent.Capture,
      // TODO: Add to type declarations for these extra parameters
      (_event, imageUri, regionBounds, displayBounds) => {
        startViewMode(imageUri, regionBounds, displayBounds);
      },
    );

    ipcMain.handle(IpcEvent.CaptureKeyupEscape, () => {
      hideAllBrowserWindows();
    });

    globalShortcut.register('Shift+Alt+CommandOrControl+G', () => {
      isInCaptureMode() && BrowserWindow.getFocusedWindow()
        ? startViewMode()
        : startCaptureMode();
    });

    globalShortcut.register('Shift+Alt+CommandOrControl+H', () => {
      if (BrowserWindow.getFocusedWindow()) {
        hideAllBrowserWindows();
      } else if (isInCaptureMode()) {
        startCaptureMode();
      } else {
        startViewMode();
      }
    });

    globalShortcut.register('Shift+Alt+CommandOrControl+L', () => {
      const browserWindowStates = getBrowserWindowStatesUnderCursor();

      if (browserWindowStates.length > 0) {
        browserWindowStates.forEach(({ browserWindow, state }) => {
          setViewBrowserWindowIsLocked(browserWindow, !state?.isLocked);
        });

        return;
      }

      const focusedWindow = BrowserWindow.getFocusedWindow();
      const focusedWindowState =
        focusedWindow && getBrowserWindowState(focusedWindow);

      if (focusedWindow) {
        setViewBrowserWindowIsLocked(
          focusedWindow,
          !focusedWindowState?.isLocked,
        );
      } else if (isInCaptureMode()) {
        startCaptureMode();
      } else {
        startViewMode();
      }
    });

    // TODO: The following works, however there is a bug that still needs to be
    // fixed. If the app is hidden and then something in the array of displays
    // changes, the app would enter _back into_ Capture mode, and the user would
    // need to hide it again. It should detect if the app is hidden. If it is,
    // rebuild the CaptureBrowserWindows in the background quietly.
    // screen.on('display-added', () => {
    //   this._window.rebuildCaptureWindows();
    // });
    // screen.on('display-removed', () => {
    //   this._window.rebuildCaptureWindows();
    // });
    // screen.on('display-metrics-changed', () => {
    //   this._window.rebuildCaptureWindows();
    // });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('before-quit', () => {
    // Electron attempts to close all browser windows before quitting, but if it
    // can't, then it won't quit. So we help Electron out by destroying all our
    // windows so it doesn't have to.
    destroyAllBrowserWindows();
  });
};
