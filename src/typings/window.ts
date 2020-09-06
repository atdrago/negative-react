import { DesktopCapturer, IpcRenderer, Remote } from 'electron';

import { CaptureCompleteEvent, CaptureEvent } from './event';

declare global {
  interface Window {
    addEventListener(
      event: 'capture',
      listener: (event: CaptureEvent) => void,
    ): void;
    addEventListener(
      event: 'capture-complete',
      listener: (event: CaptureCompleteEvent) => void,
    ): void;
    desktopCapturer: DesktopCapturer;
    removeEventListener(
      event: 'capture',
      listener: (event: CaptureEvent) => void,
    ): void;
    removeEventListener(
      event: 'capture-complete',
      listener: (event: CaptureCompleteEvent) => void,
    ): void;
    remote: Remote;
    ipcRenderer: IpcRenderer;
  }
}

export enum WINDOW_TYPE {
  CAPTURE = 'CAPTURE',
  VIEW = 'VIEW',
}
