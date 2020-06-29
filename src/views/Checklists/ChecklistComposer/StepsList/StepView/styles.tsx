import styled from 'styled-components';

export const Wrapper = styled.li.attrs({
  className: 'step-list-item',
})`
  display: flex;

  :first-child {
    .step-item-position-control {
      > .icon-up {
        visibility: hidden;
      }
    }
  }

  :last-child {
    .step-item-position-control {
      > .icon-down {
        visibility: hidden;
      }
    }
  }

  .step-item {
    &-position-control {
      align-items: center;
      display: flex;
      flex-direction: column;
      height: max-content;
      margin-right: 16px;

      .step-number {
        color: #999999;
        margin: 5px 0;
      }
    }

    &-content {
      background-color: #ffff;
      border: 1px solid transparent;
      border-radius: 5px;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
      display: flex;
      flex: 1.25;
      flex-direction: column;
      margin-bottom: 24px;
      padding: 24px 16px;
      height: max-content;

      &-active {
        border-color: #12aab3;
      }
    }

    &-media {
      flex: 1;
      margin-left: 15px;
      margin-bottom: 15px;
    }
  }
`;

export const HeaderWrapper = styled.div.attrs({
  className: 'step-item-header',
})`
  align-items: center;
  border-radius: 5px;
  display: flex;
  margin-left: 40px;

  > div {
    background-color: #f4f4f4;
    flex: 1;
  }

  input {
    background-color: transparent;
    border: none;
    border-bottom: 2px solid #ddd;
    flex: 1;
    font-size: 18px;
    font-weight: 400;
    outline: none;
    padding: 16px 8px;
    width: 100%;

    :focus {
      border-bottom-color: #12aab3;
    }
  }

  > .icon {
    margin-left: 24px;
  }

  .step-item-controls {
    display: flex;

    .item-active {
      > svg {
        color: #00aab4;
      }

      > span {
        color: #00aab4;
      }
    }

    &-item {
      align-items: center;
      border-right: 1px solid #dadada;
      cursor: pointer;
      display: flex;
      flex: 1;
      justify-content: center;
      padding: 8px 16px;

      > .icon {
        margin-right: 5px;
        height: 18px;
        width: 18px;
      }

      > span {
        color: #999999;
        font-size: 10px;
        line-height: 1;
      }

      :last-child {
        border-right: none;
      }
    }
  }
`;
