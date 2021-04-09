import { BrowserWindow, Rectangle } from 'electron';

export interface ICaptureEvent extends Event {
  displayBounds: Rectangle;
  windowBounds: Rectangle;
}

export interface IBrowserWindowEvent {
  sender: BrowserWindow;
}
