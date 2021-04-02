import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from 'electron';

import {
  getBrowserWindowState,
  hideAllBrowserWindows,
  isInCaptureMode,
  setViewBrowserWindowIsLocked,
  startCaptureMode,
  startViewMode,
} from 'main/services/window';

function moveViewWindow(deltaX: number, deltaY: number): void {
  const focusedWindow = BrowserWindow.getFocusedWindow();

  if (focusedWindow) {
    const [x, y] = focusedWindow.getPosition();

    focusedWindow.setPosition(x + deltaX, y + deltaY);
  }
}

export const createMenu = (): void => {
  const template: MenuItemConstructorOptions[] = [
    {
      label: 'Negative',
      submenu: [
        { label: 'About Negative', role: 'about' },
        { type: 'separator' },
        // { label: 'Preferences...', accelerator: 'Command+,', click: () => negative.initSettingsWindow() },
        // MENU_SEPARATOR,
        // { label: 'Reset...', click: () => negative.reset() },
        // MENU_SEPARATOR,
        {
          accelerator: 'Shift+Alt+CommandOrControl+H',
          click: (): void => hideAllBrowserWindows(),
          enabled: true,
          label: 'Hide Negative (global)',
          registerAccelerator: false,
        },
        { type: 'separator' },
        {
          accelerator: 'CommandOrControl+Q',
          click: (): void => {
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
          click: (): void => startCaptureMode(),
          label: 'New Window',
        },
        {
          role: 'close',
        },
        { type: 'separator' },
        {
          accelerator: 'Shift+Alt+CommandOrControl+G',
          click: (): void => {
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
          click: (): void =>
            BrowserWindow.getFocusedWindow()?.webContents.reload(),
          label: 'Reload',
          // enabled: canReload,
        },
        {
          accelerator: 'Alt+CommandOrControl+I',
          click: (): void =>
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
        { type: 'separator' },
        {
          accelerator: 'Shift+Alt+CommandOrControl+L',
          label: 'Lock Window',
          click: (): void => {
            const focusedWindow = BrowserWindow.getFocusedWindow();

            if (focusedWindow) {
              const state = getBrowserWindowState(focusedWindow);

              setViewBrowserWindowIsLocked(focusedWindow, !state?.isLocked);
            }
          },
        },
        { type: 'separator' },
        {
          label: 'Move',
          submenu: [
            {
              accelerator: 'Right',
              click: (): void => {
                if (!isInCaptureMode()) {
                  moveViewWindow(1, 0);
                }
              },
              enabled: !isInCaptureMode(),
              label: 'Right by 1px',
            },
            {
              accelerator: 'Left',
              click: (): void => {
                if (!isInCaptureMode()) {
                  moveViewWindow(-1, 0);
                }
              },
              enabled: !isInCaptureMode(),
              label: 'Left by 1px',
            },
            {
              accelerator: 'Up',
              click: (): void => {
                if (!isInCaptureMode()) {
                  moveViewWindow(0, -1);
                }
              },
              enabled: !isInCaptureMode(),
              label: 'Up by 1px',
            },
            {
              accelerator: 'Down',
              click: (): void => {
                if (!isInCaptureMode()) {
                  moveViewWindow(0, 1);
                }
              },
              enabled: !isInCaptureMode(),
              label: 'Down by 1px',
            },
            { type: 'separator' },
            {
              label: 'Right by 10px',
              enabled: !isInCaptureMode(),
              accelerator: 'Shift+Right',
              click: (): void => {
                if (!isInCaptureMode()) {
                  moveViewWindow(10, 0);
                }
              },
            },
            {
              accelerator: 'Shift+Left',
              click: (): void => {
                if (!isInCaptureMode()) {
                  moveViewWindow(-10, 0);
                }
              },
              enabled: !isInCaptureMode(),
              label: 'Left by 10px',
            },
            {
              accelerator: 'Shift+Up',
              click: (): void => {
                if (!isInCaptureMode()) {
                  moveViewWindow(0, -10);
                }
              },
              enabled: !isInCaptureMode(),
              label: 'Up by 10px',
            },
            {
              accelerator: 'Shift+Down',
              click: (): void => {
                if (!isInCaptureMode()) {
                  moveViewWindow(0, 10);
                }
              },
              enabled: !isInCaptureMode(),
              label: 'Down by 10px',
            },
          ],
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
};
