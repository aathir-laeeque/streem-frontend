import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  .parameter-header {
    color: #393939;
    font-size: 14px;
    letter-spacing: 0.32px;
    line-height: 1.33;
  }

  .editor-class {
    overflow-wrap: break-word;

    * {
      font-weight: unset;
    }
  }

  .toolbar-class {
    align-items: center;
    background-color: #f4f4f4;
    display: flex;
    margin-bottom: 0;
    padding: 4px 8px;

    > div:nth-child(1n) {
      border-bottom: 0;
      border-right: 1px solid #666666;
      margin-bottom: 0;

      > div {
        background: transparent;
      }

      .rdw-emoji-modal {
        background: #ffffff;
        height: auto;
        width: 294px;
        padding: 10px;

        .rdw-emoji-icon {
          padding: 4px;
          margin: unset;
          height: 34px;
          width: 34px;
        }
      }

      :last-child {
        border-right: none;
        padding-right: 0;
      }
    }
  }

  .editor-class {
    border: 1px solid #bababa;
    padding: 0 16px;

    :active {
      border-color: #1d84ff;
    }

    .public-* {
      margin: 0;
    }
  }

  ${({ isJobsView }) =>
    !isJobsView
      ? css`
          .parameter-header {
            display: none;
          }

          .toolbar-class {
            display: none;
          }

          .editor-class {
            border: none;
            padding: 0;
            pointer-events: none;
          }
        `
      : null}
`;
