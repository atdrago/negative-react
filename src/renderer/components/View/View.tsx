import React, { useEffect, useState } from 'react';

import {
  Bottom,
  Frame,
  Image,
  Top,
  Middle,
  MiddleLeft,
  MiddleRight,
} from './styled';
import { IViewBrowserWindowState } from 'typings';

export const View = () => {
  const [imageHeight, setImageHeight] = useState(0);
  const [imageUri, setImageUri] = useState('');
  const [imageWidth, setImageWidth] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    window.ipcRenderer.invoke('view-mount');

    window.ipcRenderer.on(
      'capture-complete',
      (
        _event: any,
        captureImageUri: string,
        captureBounds: any,
        _displayBounds: any,
      ) => {
        setImageHeight(captureBounds.height);
        setImageUri(captureImageUri);
        setImageWidth(captureBounds.width);
      },
    );
  }, []);

  useEffect(() => {
    const handleStateChange = (_event: any, state: IViewBrowserWindowState) => {
      if (state.isLocked !== isLocked) {
        setIsLocked(state.isLocked);
      }
    };

    window.ipcRenderer.on('state-change', handleStateChange);

    return () => {
      window.ipcRenderer.off('state-change', handleStateChange);
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
