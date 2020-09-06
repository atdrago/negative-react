import { BrowserWindow, Rectangle } from 'electron';

export interface ICaptureEvent extends Event {
  windowBounds: Rectangle;
  displayBounds: Rectangle;
}

export interface ICaptureCompleteEvent extends Event {
  imageUri: string;
}

export interface IBrowserWindowEvent {
  sender: BrowserWindow;
}
