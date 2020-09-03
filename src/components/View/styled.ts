import styled, { css } from 'styled-components';

export const Frame = styled.div`
  align-items: stretch;
  box-sizing: border-box;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  justify-content: center;
  position: relative;
  width: 100%;
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
