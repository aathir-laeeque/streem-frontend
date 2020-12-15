import styled from 'styled-components';

const ComposerWrapper = styled.div`
  display: grid;
  grid-gap: 8px;
  grid-row-gap: 16px;
  grid-template-areas: 'header header' 'stage-list task-list';
  grid-template-columns: 320px 1fr;
  grid-template-rows: auto 1fr;
  height: inherit;

  @media (max-width: 1200px) {
    grid-template-columns: 240px 1fr;

    svg {
      font-size: 16px !important;
    }
  }

  @media (min-width: 1201px) and (max-width: 1366px) {
    grid-template-columns: 280px 1fr;
  }
`;

const LoaderWrapper = styled.div`
  align-items: center;
  display: flex;
  height: inherit;
  justify-content: center;
`;

export { ComposerWrapper, LoaderWrapper };
