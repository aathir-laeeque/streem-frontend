import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  grid-area: tasks;
  grid-row-gap: 16px;
  grid-template-areas: 'stage-number' 'stage-name' 'tasks-list';
  grid-template-rows: 16px 32px 1fr;
  overflow: auto;

  .stage {
    &-name {
      align-items: center;
      color: #000000;
      cursor: default;
      display: flex;
      font-size: 24px;
      font-weight: bold;
      grid-area: stage-name;

      @media (min-width: 1920px) {
        max-width: 1200px;
        width: 1200px;
        margin: 0 auto;
      }
    }

    &-number {
      align-items: center;
      color: #666666;
      cursor: default;
      display: flex;
      font-size: 12px;
      grid-area: stage-number;

      @media (min-width: 1920px) {
        max-width: 1200px;
        width: 1200px;
        margin: 0 auto;
      }
    }
  }

  .tasks-list {
    grid-area: tasks-list;
  }
`;

export default Wrapper;
