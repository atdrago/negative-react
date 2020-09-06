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

export const init = () => {
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

    // TODO: The following works, but when a display changes it causes all
    // capture windows to be created and shown, even if the capture view was
    // not visible previously. We should be able to create them hidden by default
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
};
