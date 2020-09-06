import { app, BrowserWindow, Menu } from 'electron';

import {
  destroyAllWindows,
  hideAllWindows,
  startCaptureMode,
  startViewMode,
  isInCaptureMode,
} from 'main/services/window';

const MENU_SEPARATOR = { type: 'separator' };

let menu: Electron.Menu;

function moveViewWindow([deltaX, deltaY]: [number, number]) {
  const focusedWindow = BrowserWindow.getFocusedWindow();

  if (focusedWindow) {
    const [x, y] = focusedWindow.getPosition();

    focusedWindow.setPosition(x + deltaX, y + deltaY);
  }
}

export const createMenu = () => {
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
        {
          accelerator: 'Shift+Alt+CommandOrControl+H',
          click: () => hideAllWindows(),
          enabled: true,
          label: 'Hide Negative (global)',
          registerAccelerator: false,
        },
        MENU_SEPARATOR,
        {
          accelerator: 'CommandOrControl+Q',
          click: () => {
            destroyAllWindows();
            app.quit();
          },
          label: 'Quit Negative',
        },
      ],
    },
    {
      label: 'File',
      submenu: [
        {
          accelerator: 'CommandOrControl+N',
          click: () => startCaptureMode(),
          label: 'New Window',
        },
        {
          role: 'close',
        },
        MENU_SEPARATOR,
        {
          accelerator: 'Shift+Alt+CommandOrControl+G',
          click: () => {
            isInCaptureMode() ? startViewMode() : startCaptureMode();
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
          click: () => BrowserWindow.getFocusedWindow()?.webContents.reload(),
          label: 'Reload',
          // enabled: canReload,
        },
        {
          accelerator: 'Alt+CommandOrControl+I',
          click: () =>
            BrowserWindow.getFocusedWindow()?.webContents.toggleDevTools(),
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
              click: () => !isInCaptureMode() && moveViewWindow([1, 0]),
              enabled: !isInCaptureMode(),
              label: 'Right by 1px',
            },
            {
              accelerator: 'Left',
              click: () => !isInCaptureMode() && moveViewWindow([-1, 0]),
              enabled: !isInCaptureMode(),
              label: 'Left by 1px',
            },
            {
              accelerator: 'Up',
              click: () => !isInCaptureMode() && moveViewWindow([0, -1]),
              enabled: !isInCaptureMode(),
              label: 'Up by 1px',
            },
            {
              accelerator: 'Down',
              click: () => !isInCaptureMode() && moveViewWindow([0, 1]),
              enabled: !isInCaptureMode(),
              label: 'Down by 1px',
            },
            MENU_SEPARATOR,
            {
              label: 'Right by 10px',
              enabled: !isInCaptureMode(),
              accelerator: 'Shift+Right',
              click: () => !isInCaptureMode() && moveViewWindow([10, 0]),
            },
            {
              accelerator: 'Shift+Left',
              click: () => !isInCaptureMode() && moveViewWindow([-10, 0]),
              enabled: !isInCaptureMode(),
              label: 'Left by 10px',
            },
            {
              accelerator: 'Shift+Up',
              click: () => !isInCaptureMode() && moveViewWindow([0, -10]),
              enabled: !isInCaptureMode(),
              label: 'Up by 10px',
            },
            {
              accelerator: 'Shift+Down',
              click: () => !isInCaptureMode() && moveViewWindow([0, 10]),
              enabled: !isInCaptureMode(),
              label: 'Down by 10px',
            },
          ],
        },
      ],
    },
  ];

  // Menu.buildFromTemplate is typed incorrectly
  menu = Menu.buildFromTemplate(template as any);
  Menu.setApplicationMenu(menu);
};
