import styled from 'styled-components';

export const Wrapper = styled.div.attrs({
  className: 'step-interactions-list',
})`
  display: flex;
  flex-direction: column;

  .interaction {
    display: flex;
    margin-top: 24px;

    :first-child {
      .arrow-up {
        visibility: hidden;
      }
    }

    :last-child {
      .arrow-down {
        visibility: hidden;
      }
    }

    &-position-control {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 16px;
      height: max-content;

      > span {
        color: #999999;
        margin: 5px 0;
      }
    }

    &-content {
      flex: 1;
      padding: 16px;
      border: 1px solid transparent;
      border-radius: 4px;
      box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12),
        0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.2);

      &-active {
        border-color: #1d84ff;
      }

      .optional-switch {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        &-label {
          font-size: 16px;
          color: #666666;
        }
      }
    }

    .more-options {
      margin-left: 24px;
    }
  }
`;
