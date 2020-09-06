import styled from 'styled-components';

export const Frame = styled.div`
  -webkit-app-region: no-drag;
  -webkit-user-select: none;
  align-items: stretch;
  box-sizing: border-box;
  cursor: crosshair;
  display: flex;
  flex-grow: 1;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 100%;
`;

export const CaptureRegion = styled.div`
  position: absolute;
  border: 9999px solid rgba(0, 0, 0, 0.5);
  margin: -9999px 0 0 -9999px;

  &:after {
    content: '';
    position: absolute;
    left: -2px;
    right: -2px;
    top: -2px;
    bottom: -2px;
    border: 2px dashed white;
  }
`;
