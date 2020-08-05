import styled from 'styled-components';

export const Wrapper = styled.ol`
  margin: 0;
  padding: 0;
  counter-reset: item;
  list-style-type: none;

  .list-header {
    display: flex;
    margin-bottom: 8px;

    > span {
      display: flex;
      flex: 1;
      font-size: 16px;
      letter-spacing: 1px;
      color: #333333;

      :first-child {
        justify-content: center;
      }

      :last-child {
        justify-content: flex-end;
      }
    }
  }

  .list-item {
    align-items: center;
    display: flex;
    list-style-position: inside;
    border-bottom: 1px solid #f5f5f5;
    padding: 12px 0;

    :last-child {
      border-bottom: none;
    }

    &::before {
      color: #000000;
      content: counter(item) ' ';
      counter-increment: item;
      font-size: 14px;
      font-style: normal;
      font-weight: normal;
      margin-right: 16px;
    }

    &-image {
      align-items: center;
      background-color: #f5f5f5;
      display: flex;
      height: 56px;
      justify-content: center;
      margin-right: 12px;
      width: 56px;
    }

    .quantity-controls {
      background-color: #f5f5f5;
      display: flex;
      margin-left: 15px;

      .icon {
        align-self: center;
      }

      .quantity {
        border-bottom: 1px solid #4f4f4f;
        padding: 14px 0;
      }
    }

    .icon {
      margin-left: 5px;
    }
  }
`;
