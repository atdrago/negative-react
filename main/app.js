const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  // screen,
} = require('electron');

module.exports = {
  init() {
    console.log('asdfask');

    app.whenReady().then(() => {
      const _window = require('./window');
      const _menu = require('./menu');

      this._window = _window.init(_menu);
      this._menu = _menu.init(_window);

      this._window.startCaptureMode();

      ipcMain.handle(
        'capture',
        (_event, imageUri, regionBounds, displayBounds) => {
          this._window.startViewMode(imageUri, regionBounds, displayBounds);
        },
      );

      ipcMain.handle('capture-keyup-escape', () => {
        this._window.hideAllWindows();
      });

      globalShortcut.register('Shift+Alt+CommandOrControl+G', () => {
        this._window.isInCaptureMode() && BrowserWindow.getFocusedWindow()
          ? this._window.startViewMode()
          : this._window.startCaptureMode();
      });

      globalShortcut.register('Shift+Alt+CommandOrControl+H', () => {
        if (BrowserWindow.getFocusedWindow()) {
          this._window.hideAllWindows();
        } else {
          this._window.isInCaptureMode()
            ? this._window.startCaptureMode()
            : this._window.startViewMode();
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

    /**
     * NOTE: We might not want to do this so I'm commenting it for now
     */
    // app.on('activate', () => {
    //   // If the app is clicked and no windows are open, open a new window
    //   if (windows.length === 0) {
    //     createWindow(WINDOW_TYPE.CAPTURE);
    //   }
    // });

    // ipcMain.handle('hide-focused-window', async () => {
    //   const focusedWindow = BrowserWindow.getFocusedWindow();
    //   focusedWindow.hide();

    //   ipcMain.handleOnce('show-focused-window', async () => {
    //     focusedWindow.show();
    //   });
    // });
  },
};
