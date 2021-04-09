import { IpcRendererEvent, Rectangle } from 'electron';
import React, { useEffect, useState } from 'react';

import { IpcEvent, IViewBrowserWindowState } from 'typings';

import {
  Bottom,
  Frame,
  Image,
  Top,
  Middle,
  MiddleLeft,
  MiddleRight,
} from './styled';

export const View = () => {
  const [imageHeight, setImageHeight] = useState(0);
  const [imageUri, setImageUri] = useState('');
  const [imageWidth, setImageWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    window.ipcRenderer.invoke(IpcEvent.ViewMount);
  }, []);

  useEffect(() => {
    function handleStateChange(
      _event: IpcRendererEvent,
      state: IViewBrowserWindowState,
    ) {
      if (state.isLocked !== isLocked) {
        setIsLocked(state.isLocked);
      }
    }

    function handleCaptureComplete(
      _event: IpcRendererEvent,
      captureImageUri: string,
      captureBounds: Rectangle,
    ) {
      setImageHeight(captureBounds.height);
      setImageUri(captureImageUri);
      setImageWidth(captureBounds.width);
    }

    window.ipcRenderer.on(IpcEvent.CaptureComplete, handleCaptureComplete);
    window.ipcRenderer.on(IpcEvent.StateChange, handleStateChange);

    return () => {
      window.ipcRenderer.off(IpcEvent.CaptureComplete, handleCaptureComplete);
      window.ipcRenderer.off(IpcEvent.StateChange, handleStateChange);
    };
  }, [isLocked]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <Frame isLocked={isLocked}>
      <Top />
      <Middle style={{ height: imageHeight }}>
        <MiddleLeft />
        <Image
          onLoad={handleLoad}
          alt=""
          src={imageUri}
          style={{
            height: imageHeight,
            width: imageWidth,
            opacity: isLoading ? 0 : 0.5,
          }}
        />
        <MiddleRight />
      </Middle>
      <Bottom />
    </Frame>
  );
};
