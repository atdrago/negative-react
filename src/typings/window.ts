import { BrowserWindow, DesktopCapturer, IpcRenderer, Remote } from 'electron';

import { ICaptureCompleteEvent, ICaptureEvent } from 'typings';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    addEventListener(
      event: 'capture',
      listener: (event: ICaptureEvent) => void,
    ): void;
    addEventListener(
      event: 'capture-complete',
      listener: (event: ICaptureCompleteEvent) => void,
    ): void;
    desktopCapturer: DesktopCapturer;
    removeEventListener(
      event: 'capture',
      listener: (event: ICaptureEvent) => void,
    ): void;
    removeEventListener(
      event: 'capture-complete',
      listener: (event: ICaptureCompleteEvent) => void,
    ): void;
    remote: Remote;
    ipcRenderer: IpcRenderer;
  }
}

export enum WINDOW_TYPE {
  CAPTURE = 'CAPTURE',
  VIEW = 'VIEW',
}

export interface IViewBrowserWindowState {
  isLocked: boolean;
}

export type BrowserWindowWithState = {
  browserWindow: BrowserWindow;
  type: WINDOW_TYPE;
} & (
  | {
      state: IViewBrowserWindowState;
      type: typeof WINDOW_TYPE.VIEW;
    }
  | {
      state: null;
      type: typeof WINDOW_TYPE.CAPTURE;
    }
);
