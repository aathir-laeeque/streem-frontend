import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  .activity-header {
    color: #393939;
    font-size: 12px;
    letter-spacing: 0.32px;
    line-height: 1.33;
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
        width: 210px;
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

  ${(props) =>
    !props.isEditing
      ? css`
          .activity-header {
            display: none;
          }
        `
      : null}
`;
