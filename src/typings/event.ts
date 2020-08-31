import { Rectangle } from 'electron';

export interface CaptureEvent extends Event {
  windowBounds: Rectangle;
  displayBounds: Rectangle;
}

export interface CaptureCompleteEvent extends Event {
  imageUri: string;
}
