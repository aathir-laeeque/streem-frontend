import styled from 'styled-components';

export const ComposerWrapper = styled.div<Pick<any, 'fullView'>>`
  display: grid;
  grid-gap: 8px;
  grid-row-gap: 16px;
  grid-template-areas: 'header header' 'stages tasks';
  grid-template-columns: 320px 1fr;
  grid-template-rows: auto 1fr;
  overflow: hidden;
  background-color: #ecedf1;
  position: ${({ fullView }) => (fullView ? 'fixed' : 'static')};
  inset: ${({ fullView }) => (fullView ? '0' : 'unset')};

  @media (max-width: 1200px) {
    grid-template-columns: 240px 1fr;
  }

  @media (min-width: 1201px) and (max-width: 1366px) {
    grid-template-columns: 280px 1fr;
  }
`;

export const JobLoadingWrapper = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
