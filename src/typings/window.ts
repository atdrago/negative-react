import { BrowserWindow, DesktopCapturer, Screen } from 'electron';

import { IIpcRendererWithCustomEvents } from 'typings';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    desktopCapturer: DesktopCapturer;
    remoteScreen: Screen;
    ipcRenderer: IIpcRendererWithCustomEvents;
  }
}

export enum WindowType {
  Capture = 'CAPTURE',
  View = 'VIEW',
}

export interface IViewBrowserWindowState {
  isLocked: boolean;
}

export type BrowserWindowWithState = {
  browserWindow: BrowserWindow;
  type: WindowType;
} & (
  | {
      state: IViewBrowserWindowState;
      type: typeof WindowType.View;
    }
  | {
      state: null;
      type: typeof WindowType.Capture;
    }
);
