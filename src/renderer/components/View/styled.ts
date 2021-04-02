import styled, { css } from 'styled-components';

export const Frame = styled.div<{ isLocked?: boolean }>`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: 100%;

  &:after {
    color: white;
    content: '☁︎';
    font-size: 1.2rem;
    opacity: ${({ isLocked }) => (isLocked ? '1' : '0')};
    position: absolute;
    top: 6px;
    right: 12px;
    transform: translateX(${({ isLocked }) => (isLocked ? '0' : '30px')});
    transition: transform 200ms ease-out, opacity 200ms ease-out;
  }
`;

const flexGrowStyles = css`
  background: rgba(0, 0, 0, 0.5);
  flex: 1 0 auto;
`;

export const Bottom = styled.div`
  ${flexGrowStyles};
`;
export const Middle = styled.div`
  display: flex;
`;
export const MiddleLeft = styled.div`
  ${flexGrowStyles};
`;
export const MiddleRight = styled.div`
  ${flexGrowStyles};
`;
export const Top = styled.div`
  ${flexGrowStyles};
`;

export const Image = styled.img`
  background: none;
  filter: invert(100%);
  pointer-events: none;
  transition: opacity 300ms ease;
`;
