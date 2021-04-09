import { Rectangle, IpcRenderer, IpcRendererEvent } from 'electron';

import { IViewBrowserWindowState } from 'typings';

type IpcCaptureHandler = (
  event: IpcRendererEvent,
  imageUri: string,
  captureBounds: Rectangle,
  displayBounds: Rectangle,
) => void;

type IpcGenericHandler = (event: IpcRendererEvent) => void;

type IpcStateHandler = (
  event: IpcRendererEvent,
  state: IViewBrowserWindowState,
) => void;

export enum IpcEvent {
  Capture = 'capture',
  CaptureComplete = 'capture-complete',
  CaptureKeyupEscape = 'capture-keyup-escape',
  StateChange = 'state-change',
  ViewMount = 'view-mount',
}

export interface IIpcRendererWithCustomEvents extends IpcRenderer {
  off(channel: IpcEvent.Capture, handler: IpcCaptureHandler): this;
  off(channel: IpcEvent.CaptureComplete, handler: IpcCaptureHandler): this;
  off(channel: IpcEvent.CaptureKeyupEscape, handler: IpcGenericHandler): this;
  off(channel: IpcEvent.StateChange, handler: IpcStateHandler): this;
  off(channel: IpcEvent.ViewMount, handler: IpcGenericHandler): this;
  on(channel: IpcEvent.Capture, handler: IpcCaptureHandler): this;
  on(channel: IpcEvent.CaptureComplete, handler: IpcCaptureHandler): this;
  on(channel: IpcEvent.CaptureKeyupEscape, handler: IpcGenericHandler): this;
  on(channel: IpcEvent.StateChange, handler: IpcStateHandler): this;
  on(channel: IpcEvent.ViewMount, handler: IpcGenericHandler): this;
}
