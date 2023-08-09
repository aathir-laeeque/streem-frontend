import styled from 'styled-components';

export const LoadingDiv = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: -1;
  flex-direction: column;
  gap: 16px;
  .progress-bar {
    width: 50%;
  }
`;
