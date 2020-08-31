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

export const View = () => {
  const [imageHeight, setImageHeight] = useState(0);
  const [imageUri, setImageUri] = useState('');
  const [imageWidth, setImageWidth] = useState(0);

  useEffect(() => {
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

  return (
    <Frame>
      <Top />
      <Middle style={{ height: imageHeight }}>
        <MiddleLeft />
        <Image
          alt=""
          src={imageUri}
          style={{ height: imageHeight, width: imageWidth }}
        />
        <MiddleRight />
      </Middle>
      <Bottom />
    </Frame>
  );
};
