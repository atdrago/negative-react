const { app, BrowserWindow, Menu } = require('electron');

const {
  startCaptureMode,
  isInCaptureMode,
  startViewMode,
} = require('../window');

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

const template = [
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
        accelerator: 'Command+Q',
        click: () => app.quit(),
      },
    ],
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'New Window',
        accelerator: 'Command+N',
        click: () => {
          startCaptureMode();
        },
      },
      {
        role: 'close',
      },
      MENU_SEPARATOR,
      {
        label: 'Capture',
        accelerator: 'Command+G',
        click: () => {
          isInCaptureMode() ? startViewMode() : startCaptureMode();
        },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'Command+R',
        click: () => BrowserWindow.getFocusedWindow().reload(),
        // enabled: canReload,
      },
      {
        label: 'Toggle DevTools',
        accelerator: 'Alt+Command+I',
        click: () => BrowserWindow.getFocusedWindow().toggleDevTools(),
        // enabled: canToggleDevTools,
      },
    ],
  },
  {
    label: 'Window',
    submenu: [
      //     { label: 'Minimize', accelerator: 'Command+M', role: 'minimize' },
      //     MENU_SEPARATOR,
      //     {
      //       label: 'Fit Window to Image',
      //       accelerator: 'Command+F',
      //       click: () => negative.fitWindowToImage(),
      //       enabled: canMinimize,
      //     },
      //     MENU_SEPARATOR,
      //     {
      //       label: 'Next Tab',
      //       accelerator: 'Command+}',
      //       click: () => negative.selectNextTab(),
      //       enabled: canInteractWithTabs,
      //     },
      //     {
      //       label: 'Previous Tab',
      //       accelerator: 'Command+{',
      //       click: () => negative.selectPreviousTab(),
      //       enabled: canInteractWithTabs,
      //     },
      //     {
      //       label: 'Next Tab and Resize',
      //       accelerator: 'Alt+Command+}',
      //       click: () => negative.selectNextTabAndResizeWindowToFitImage(),
      //       enabled: canInteractWithTabs,
      //     },
      //     {
      //       label: 'Previous Tab and Resize',
      //       accelerator: 'Alt+Command+{',
      //       click: () => negative.selectPreviousTabAndResizeWindowToFitImage(),
      //       enabled: canInteractWithTabs,
      //     },
      //     MENU_SEPARATOR,
      {
        label: 'Move',
        submenu: [
          {
            label: 'Right by 1px',
            accelerator: 'Right',
            click: () => moveViewWindow([1, 0]),
            enabled: !isInCaptureMode(),
          },
          {
            label: 'Left by 1px',
            accelerator: 'Left',
            click: () => moveViewWindow([-1, 0]),
            enabled: !isInCaptureMode(),
          },
          {
            label: 'Up by 1px',
            accelerator: 'Up',
            click: () => moveViewWindow([0, -1]),
            enabled: !isInCaptureMode(),
          },
          {
            label: 'Down by 1px',
            accelerator: 'Down',
            click: () => moveViewWindow([0, 1]),
            enabled: !isInCaptureMode(),
          },
          MENU_SEPARATOR,
          {
            label: 'Right by 10px',
            accelerator: 'Shift+Right',
            click: () => moveViewWindow([10, 0]),
            enabled: !isInCaptureMode(),
          },
          {
            label: 'Left by 10px',
            accelerator: 'Shift+Left',
            click: () => moveViewWindow([-10, 0]),
            enabled: !isInCaptureMode(),
          },
          {
            label: 'Up by 10px',
            accelerator: 'Shift+Up',
            click: () => moveViewWindow([0, -10]),
            enabled: !isInCaptureMode(),
          },
          {
            label: 'Down by 10px',
            accelerator: 'Shift+Down',
            click: () => moveViewWindow([0, 10]),
            enabled: !isInCaptureMode(),
          },
        ],
      },
    ],
  },
];
const menu = Menu.buildFromTemplate(template);

module.exports = {
  menu,
};
