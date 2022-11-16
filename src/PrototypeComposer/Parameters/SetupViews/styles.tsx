import styled from 'styled-components';

export const CommonWrapper = styled.div`
  padding-block: 16px;
  .list {
    list-style-type: none;
    margin: 16px 0 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    row-gap: 8px;

    &-item {
      display: flex;
      align-items: center;
      column-gap: 16px;

      > svg {
        margin-top: 18px;
      }

      .input-label {
        color: #525252;
        display: flex;
        font-size: 12px;
        letter-spacing: 0.32px;
        line-height: 1.33;
        margin-bottom: 8px;
      }
    }
  }
  .form-row {
    flex: 1;
    flex-direction: row;
    gap: 16px;

    > div {
      flex: 1;
      margin-bottom: 16px;
    }
  }
`;
