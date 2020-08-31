import styled from 'styled-components';

export const Frame = styled.div`
  -webkit-app-region: no-drag;
  -webkit-user-select: none;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  cursor: crosshair;
  display: flex;
  flex-grow: 1;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: background-color 300ms ease;
  width: 100%;

  &:hover {
    background-color: rgba(0, 0, 0, 0);
  }
`;

export const CaptureRegion = styled.div`
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 1);
`;
