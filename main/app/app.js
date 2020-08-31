const { app, Menu, ipcMain } = require('electron');

const { menu } = require('../menu');
const { startCaptureMode, startViewMode } = require('../window');

const init = () => {
  // app.on('ready', () => startCaptureMode());

  app.whenReady().then(() => startCaptureMode());

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

  ipcMain.handle('capture', (_event, imageUri, regionBounds, displayBounds) => {
    startViewMode(imageUri, regionBounds, displayBounds);
  });

  Menu.setApplicationMenu(menu);
};

module.exports = { init };
