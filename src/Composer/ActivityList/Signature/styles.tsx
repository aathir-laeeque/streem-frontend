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
