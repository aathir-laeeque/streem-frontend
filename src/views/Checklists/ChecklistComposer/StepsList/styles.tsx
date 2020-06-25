import styled from 'styled-components';

export const Wrapper = styled.div`
  display: grid;
  grid-template-areas: 'stagenumber' 'stagename' 'steps';
  grid-template-rows: 16px 32px 1fr;
  grid-area: steplist;
  overflow: hidden;
  padding: 24px 0 0 16px;

  > .stage {
    &-number {
      grid-area: stagenumber;
      color: #666666;
      font-size: 12px;
      display: flex;
      align-items: center;
      cursor: default;
    }

    &-name {
      grid-area: stagename;
      color: #000000;
      font-size: 24px;
      font-weight: bold;
      margin-top: 4px;
      display: flex;
      align-items: center;
      cursor: default;
    }
  }

  .step {
    &-list {
      counter-reset: item;
      grid-area: steps;
      margin: 0;
      margin-top: 16px;
      overflow: scroll;
      padding: 0;
    }
  }
`;
