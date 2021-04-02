import { app, BrowserWindow, globalShortcut, ipcMain } from 'electron';

import {
  hideAllWindows,
  isInCaptureMode,
  startCaptureMode,
  startViewMode,
} from 'main/services/window';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit();
}

export const init = (): void => {
  app.whenReady().then(() => {
    startCaptureMode();

    ipcMain.handle(
      // TODO : Add to type declarations
      'capture',
      (_event, imageUri, regionBounds, displayBounds) => {
        startViewMode(imageUri, regionBounds, displayBounds);
      },
    );

    ipcMain.handle('capture-keyup-escape', () => {
      hideAllWindows();
    });

    globalShortcut.register('Shift+Alt+CommandOrControl+G', () => {
      isInCaptureMode() && BrowserWindow.getFocusedWindow()
        ? startViewMode()
        : startCaptureMode();
    });

    globalShortcut.register('Shift+Alt+CommandOrControl+H', () => {
      if (BrowserWindow.getFocusedWindow()) {
        hideAllWindows();
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

  // ipcMain.handle('hide-focused-window', async () => {
  //   const focusedWindow = BrowserWindow.getFocusedWindow();
  //   focusedWindow.hide();

  //   ipcMain.handleOnce('show-focused-window', async () => {
  //     focusedWindow.show();
  //   });
  // });
  app.on('before-quit', () => {
    // Electron attempts to close all browser windows before quitting, but if it
    // can't, then it won't quit. So we help Electron out by destroying all our
    // windows so it doesn't have to.
    destroyAllBrowserWindows();
  });
};
