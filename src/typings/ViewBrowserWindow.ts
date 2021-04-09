import { Rectangle } from 'electron';

export interface IViewBrowserWindowProps {
  imageUri: string;
  captureBounds: Rectangle;
  displayBounds: Rectangle;
}
