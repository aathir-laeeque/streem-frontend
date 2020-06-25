import styled from 'styled-components';

export const Wrapper = styled.div`
  background-color: #fff;
  box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.12), 1px 0 1px 0 rgba(0, 0, 0, 0.14);
  grid-area: stagelist;
  overflow: hidden;
  position: relative;

  .stage {
    &-list {
      counter-reset: item;
      display: flex;
      flex-direction: column;
      list-style-type: none;
      margin: 0;
      padding: 8px;
      max-height: calc(100% - 80px);
      overflow: scroll;

      &-item {
        align-items: center;
        background-color: #ffffff;
        border-radius: 3px;
        /* box-shadow: 1px 0 3px 0 rgba(0, 0, 0, 0.12), 1px 0 1px 0 rgba(0, 0, 0, 0.14); */
        display: flex;
        line-height: normal;
        list-style-position: inside;
        padding: 8px;
        margin-bottom: 8px;
        border: 1.5px solid transparent;
        border-color: #f4f4f4;
        cursor: pointer;

        &-active {
          border-color: #12aab3;
        }

        :last-child {
          margin-bottom: 0;
        }

        &::before {
          content: counter(item) ' ';
          counter-increment: item;
          margin: 0 16px;
        }

        div {
          flex: 1;
        }

        input {
          display: flex;
          flex: 1;
          background-color: #f4f4f4;
          padding: 8px;
          border-radius: 4px;
          font-size: 16px;
          font-weight: 600;
          color: #333333;
          border: none;
          outline: none;
          width: 100%;
        }
      }

      &-control-buttons {
        display: flex;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.1);
        margin-top: auto;
        position: absolute;
        bottom: 8px;
        right: 8px;
        width: calc(100% - 16px);

        > div {
          display: flex;
          flex: 1;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          border-right: 1.5px solid #f4f4f4;

          :last-child {
            border: none;
          }

          > span {
            font-size: 8px;
            line-height: 1;
            color: #333333;
            text-transform: capitalize;
            margin-top: 5px;
          }
        }
      }
    }
  }
`;
