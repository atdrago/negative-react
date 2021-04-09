import React, { useEffect, useRef, useState } from 'react';

import { captureRegionOfScreen } from 'renderer/utils/captureRegionOfScreen';
import { IpcEvent } from 'typings';

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

  const isMouseDownRef = useRef(isMouseDown);

  function handleMouseDown(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    const { clientX, clientY } = event;

    setIsMouseDown(true);
    setLeft(clientX);
    setMouseDownX(clientX);
    setMouseDownY(clientY);
    setTop(clientY);
  }

  function handleMouseMove(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) {
    if (isMouseDown) {
      const { clientX, clientY } = event;

      const nextLeft = Math.min(clientX, mouseDownX);
      const nextTop = Math.min(clientY, mouseDownY);

      setLeft(nextLeft);
      setTop(nextTop);
      setHeight(Math.max(clientY, mouseDownY) - nextTop);
      setWidth(Math.max(clientX, mouseDownX) - nextLeft);
    }

    if (!isFrameFocused) {
      setTimeout(() => {
        frameRef.current?.focus();
        frameRef.current?.ownerDocument?.documentElement.focus();
        window.focus();
      }, 0);
      setIsFrameFocused(true);
    }
  }

  function handleMouseUp() {
    setIsMouseDown(false);
  }

  function handleMouseLeave() {
    setIsFrameFocused(false);
  }

  useEffect(() => {
    function handleKeyUp(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        // If Escape is pressed while dragging the capture region, stop the
        // capture and reset it to defaults
        if (isMouseDown) {
          setHeight(0);
          setIsMouseDown(false);
          setLeft(0);
          setMouseDownX(0);
          setMouseDownY(0);
          setTop(0);
          setWidth(0);
        } else {
          // If Escape is pressed while sitting in capture mode, exit capture mode
          window.ipcRenderer.invoke(IpcEvent.CaptureKeyupEscape);
        }
      }
    }

    window.addEventListener('keyup', handleKeyUp, false);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isMouseDown]);

  useEffect(() => {
    async function captureAndResetCropRectangle() {
      // `isMouseDown` was true and is now false
      if (isMouseDownRef.current && !isMouseDown) {
        const screenPoint = await window.remoteScreen.getCursorScreenPoint();
        const {
          bounds: displayBounds,
        } = await window.remoteScreen.getDisplayNearestPoint(screenPoint);

        const regionBounds = {
          height,
          width,
          x: left,
          y: top,
        };

        const imageUri = await captureRegionOfScreen(
          regionBounds,
          displayBounds,
        );

        window.ipcRenderer.invoke(
          IpcEvent.Capture,
          imageUri,
          regionBounds,
          displayBounds,
        );

        setHeight(0);
        setLeft(0);
        setTop(0);
        setWidth(0);
      }
    }

    captureAndResetCropRectangle();
  }, [height, isMouseDown, left, top, width]);

  useEffect(() => {
    isMouseDownRef.current = isMouseDown;
  }, [isMouseDown]);

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
