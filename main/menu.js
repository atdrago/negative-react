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
          {
            accelerator: 'Shift+Alt+CommandOrControl+H',
            click: () => this._window.hideAllWindows(),
            enabled: true,
            label: 'Hide Negative (global)',
            registerAccelerator: false,
          },
          MENU_SEPARATOR,
          {
            accelerator: 'CommandOrControl+Q',
            click: () => app.quit(),
            label: 'Quit Negative',
          },
        ],
      },
      {
        label: 'File',
        submenu: [
          {
            accelerator: 'CommandOrControl+N',
            click: () => this._window.startCaptureMode(),
            label: 'New Window',
          },
          {
            role: 'close',
          },
          MENU_SEPARATOR,
          {
            accelerator: 'Shift+Alt+CommandOrControl+G',
            click: () => {
              this._window.isInCaptureMode()
                ? this._window.startViewMode()
                : this._window.startCaptureMode();
            },
            label: 'Capture mode (global)',
            registerAccelerator: false,
          },
        ],
      },
      {
        label: 'View',
        submenu: [
          {
            accelerator: 'CommandOrControl+R',
            click: () => BrowserWindow.getFocusedWindow().reload(),
            label: 'Reload',
            // enabled: canReload,
          },
          {
            accelerator: 'Alt+CommandOrControl+I',
            click: () => BrowserWindow.getFocusedWindow().toggleDevTools(),
            label: 'Toggle DevTools',
            // enabled: canToggleDevTools,
          },
        ],
      },
      {
        label: 'Window',
        submenu: [
          { accelerator: 'Command+M', label: 'Minimize', role: 'minimize' },
          MENU_SEPARATOR,
          {
            label: 'Move',
            submenu: [
              {
                accelerator: 'Right',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([1, 0]),
                enabled: !this._window.isInCaptureMode(),
                label: 'Right by 1px',
              },
              {
                accelerator: 'Left',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([-1, 0]),
                enabled: !this._window.isInCaptureMode(),
                label: 'Left by 1px',
              },
              {
                accelerator: 'Up',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([0, -1]),
                enabled: !this._window.isInCaptureMode(),
                label: 'Up by 1px',
              },
              {
                accelerator: 'Down',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([0, 1]),
                enabled: !this._window.isInCaptureMode(),
                label: 'Down by 1px',
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
                accelerator: 'Shift+Left',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([-10, 0]),
                enabled: !this._window.isInCaptureMode(),
                label: 'Left by 10px',
              },
              {
                accelerator: 'Shift+Up',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([0, -10]),
                enabled: !this._window.isInCaptureMode(),
                label: 'Up by 10px',
              },
              {
                accelerator: 'Shift+Down',
                click: () =>
                  !this._window.isInCaptureMode() && moveViewWindow([0, 10]),
                enabled: !this._window.isInCaptureMode(),
                label: 'Down by 10px',
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
