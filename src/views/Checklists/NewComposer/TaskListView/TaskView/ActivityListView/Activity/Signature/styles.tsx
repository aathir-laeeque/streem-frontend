import styled from 'styled-components';

export const Wrapper = styled.div.attrs({})`
  /* TODO: make styles better */
  .signature-interaction {
    border-radius: 4px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 240px;
    border: dashed 1px #e0e0e0;
    background-color: #f2f2f2;

    > span {
      color: #bdbdbd;
      font-size: 14px;
      text-align: center;
    }

    > .icon-container {
      display: flex;
      flex-direction: column;
      margin-bottom: 13px;
    }

    .signed-header {
      display: flex;
      align-items: center;
      justify-content: space-between;

      > .top-right {
        display: flex;
        flex-direction: column;

        > span {
          font-size: 14px;
          color: #4f4f4f;
          text-align: right;
        }
      }

      > .top-left {
        display: flex;
        flex-direction: column;

        > span {
          font-size: 14px;
          color: #4f4f4f;
          text-align: left;
        }
      }
    }
  }

  .signature-interaction.active {
    background-color: #fff;
    cursor: pointer;

    > span {
      color: #000;
      font-size: 14px;
      text-align: center;
    }

    > .icon-container {
      display: flex;
      flex-direction: column;
      margin-bottom: 13px;
    }
  }
`;
