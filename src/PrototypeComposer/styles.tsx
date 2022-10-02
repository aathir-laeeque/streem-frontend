import styled from 'styled-components';

export const ComposerWrapper = styled.div`
  display: grid;
  grid-row-gap: 16px;
  grid-column-gap: 8px;
  grid-template-areas: 'header header' 'stage-list task-list';
  grid-template-columns: 320px 1fr;
  grid-template-rows: auto 1fr;
  overflow: hidden;
  height: 100%;

  @media (max-width: 1200px) {
    grid-template-columns: 240px 1fr;

    svg {
      font-size: 16px !important;
    }
  }

  @media (min-width: 1201px) and (max-width: 1366px) {
    grid-template-columns: 280px 1fr;
  }

  .add-item {
    background-color: transparent;
    width: 100%;
    margin-bottom: 16px;

    :hover {
      color: unset;
      border-color: unset;
      > .icon {
        color: inherit;
      }
    }

    > .icon {
      margin-right: 8px;
    }
  }
`;
