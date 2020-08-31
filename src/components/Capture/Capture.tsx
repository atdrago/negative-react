import React, { useRef, useState } from 'react';

import { captureRegionOfScreen } from 'utils/captureRegionOfScreen';

import { CaptureRegion, Frame } from './styled';

export const Capture = () => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [isFrameFocused, setIsFrameFocused] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseDownX, setMouseDownX] = useState(0);
  const [mouseDownY, setMouseDownY] = useState(0);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  const handleMouseDown = async (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    setIsMouseDown(true);

    setMouseDownX(event.clientX);
    setMouseDownY(event.clientY);
    setLeft(event.clientX);
    setTop(event.clientY);
  };

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (isMouseDown) {
      const { clientX, clientY } = event;

      const nextLeft = Math.min(clientX, mouseDownX);
      const nextTop = Math.min(clientY, mouseDownY);

      const nextHeight = Math.max(clientY, mouseDownY) - nextTop;
      const nextWidth = Math.max(clientX, mouseDownX) - nextLeft;

      setHeight(nextHeight);
      setLeft(nextLeft);
      setTop(nextTop);
      setWidth(nextWidth);
    }

    if (!isFrameFocused) {
      setTimeout(() => {
        if (frameRef.current) {
          frameRef.current.focus();
          frameRef.current.ownerDocument?.documentElement.focus();
        }
        window.focus();
      }, 0);
      setIsFrameFocused(true);
    }
  };

  const handleMouseUp = async (
    _event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    if (isMouseDown) {
      const screenPoint = await window.remote.screen.getCursorScreenPoint();
      const {
        bounds: displayBounds,
      } = await window.remote.screen.getDisplayNearestPoint(screenPoint);

      const regionBounds = {
        height,
        width,
        x: left,
        y: top,
      };

      const imageUri = await captureRegionOfScreen(regionBounds, displayBounds);

      window.ipcRenderer.invoke(
        'capture',
        imageUri,
        regionBounds,
        displayBounds,
      );
    }

    setIsMouseDown(false);
    setHeight(0);
    setLeft(0);
    setTop(0);
    setWidth(0);
  };

  const handleMouseLeave = () => {
    setIsFrameFocused(false);
  };

  return (
    <Frame
      ref={frameRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <CaptureRegion
        style={{
          height: `${height}px`,
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
        }}
      />
    </Frame>
  );
};
