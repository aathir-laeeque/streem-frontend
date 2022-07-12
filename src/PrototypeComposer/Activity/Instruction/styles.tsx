import styled from 'styled-components';

export const Wrapper = styled.div`
  .activity-header {
    font-size: 14px;
    letter-spacing: 0.32px;
    line-height: 1.33;
    margin-bottom: 12px;
  }

  .editor-class {
    overflow-wrap: break-word;
    border: 1px solid #bababa;
    padding: 0 16px;

    &.error {
      border: solid 1px #ff6b6b;
    }

    * {
      font-weight: unset;
    }

    :active {
      border-color: #1d84ff;
    }

    .public-* {
      margin: 0;
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
`;
