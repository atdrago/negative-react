import { DesktopCapturer, IpcRenderer, Remote } from 'electron';

import { ICaptureCompleteEvent, ICaptureEvent } from 'typings';

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
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
