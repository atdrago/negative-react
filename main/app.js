const { app, ipcMain, globalShortcut } = require('electron');

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

      globalShortcut.register('CommandOrControl+Alt+G', () => {
        this._window.isInCaptureMode()
          ? this._window.startViewMode()
          : this._window.startCaptureMode();
      });
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
