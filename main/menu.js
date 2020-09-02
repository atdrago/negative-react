const { app, BrowserWindow, Menu } = require('electron');

const MENU_SEPARATOR = { type: 'separator' };

/**
 *
 * @param {[number, number]} delta
 */
function moveViewWindow([deltaX, deltaY]) {
  const focusedWindow = BrowserWindow.getFocusedWindow();
  const [x, y] = focusedWindow.getPosition();

  focusedWindow.setPosition(x + deltaX, y + deltaY);
}

module.exports = {
  menu: null,
  init(_window) {
    this._window = _window;

    this.createMenu();

    return this;
  },
  createMenu() {
    this.template = [
      {
        label: 'Negative',
        submenu: [
          { label: 'About Negative', role: 'about' },
          MENU_SEPARATOR,
          // { label: 'Preferences...', accelerator: 'Command+,', click: () => negative.initSettingsWindow() },
          // MENU_SEPARATOR,
          // { label: 'Reset...', click: () => negative.reset() },
          // MENU_SEPARATOR,
          // { label: 'Lock Negative', accelerator: 'Command+Control+L', click: () => negative.toggleLocking(), type: 'checkbox', checked: isAppLocked },
          // { label: 'Hide Negative', accelerator: 'Command+Control+H', click: () => negative.toggleHiding(), type: 'checkbox', checked: isAppHidden },
          // MENU_SEPARATOR,
          {
            label: 'Quit Negative',
            accelerator: 'CommandOrControl+Q',
            click: () => app.quit(),
          },
        ],
      },
      {
        label: 'File',
        submenu: [
          {
            label: 'New Window',
            accelerator: 'CommandOrControl+N',
            click: () => {
              this._window.startCaptureMode();
            },
          },
          {
            role: 'close',
          },
          MENU_SEPARATOR,
          {
            label: 'Capture',
            accelerator: 'CommandOrControl+Alt+G',
            click: () => {
              this._window.isInCaptureMode()
                ? this._window.startViewMode()
                : this._window.startCaptureMode();
            },
          },
        ],
      },
      {
        label: 'View',
        submenu: [
          {
            label: 'Reload',
            accelerator: 'CommandOrControl+R',
            click: () => BrowserWindow.getFocusedWindow().reload(),
            // enabled: canReload,
          },
          {
            label: 'Toggle DevTools',
            accelerator: 'Alt+CommandOrControl+I',
            click: () => BrowserWindow.getFocusedWindow().toggleDevTools(),
            // enabled: canToggleDevTools,
          },
        ],
      },
      {
        label: 'Window',
        submenu: [
          { label: 'Minimize', accelerator: 'Command+M', role: 'minimize' },
          MENU_SEPARATOR,
          {
            label: 'Move',
            submenu: [
              {
                label: 'Right by 1px',
                enabled: !this._window.isInCaptureMode(),
                accelerator: 'Right',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([1, 0]),
              },
              {
                label: 'Left by 1px',
                enabled: !this._window.isInCaptureMode(),
                accelerator: 'Left',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([-1, 0]),
              },
              {
                label: 'Up by 1px',
                enabled: !this._window.isInCaptureMode(),
                accelerator: 'Up',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([0, -1]),
              },
              {
                label: 'Down by 1px',
                enabled: !this._window.isInCaptureMode(),
                accelerator: 'Down',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([0, 1]),
              },
              MENU_SEPARATOR,
              {
                label: 'Right by 10px',
                enabled: !this._window.isInCaptureMode(),
                accelerator: 'Shift+Right',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([10, 0]),
              },
              {
                label: 'Left by 10px',
                enabled: !this._window.isInCaptureMode(),
                accelerator: 'Shift+Left',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([-10, 0]),
              },
              {
                accelerator: 'Shift+Up',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([0, -10]),
                enabled: !this._window.isInCaptureMode(),
                label: 'Up by 10px',
              },
              {
                label: 'Down by 10px',
                enabled: !this._window.isInCaptureMode(),
                accelerator: 'Shift+Down',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([0, 10]),
              },
            ],
          },
        ],
      },
    ];

    this.menu = Menu.buildFromTemplate(this.template);
    Menu.setApplicationMenu(this.menu);
  },
};
