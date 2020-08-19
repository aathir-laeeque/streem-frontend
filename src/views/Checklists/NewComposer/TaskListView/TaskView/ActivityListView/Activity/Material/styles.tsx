import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  .header {
    color: #000000;
    font-size: 12px;
    letter-spacing: 0.32px;
    line-height: 1.33;
    margin-bottom: 8px;
  }

  .list {
    &-container {
      margin: 0;
      padding: 0;
      counter-reset: item;
      list-style-type: none;
    }

    &-item {
      list-style-position: inside;
      margin-bottom: 8px;
      display: flex;
      align-items: center;

      :last-of-type {
        margin-bottom: 0;
      }

      &::before {
        color: #000000;
        content: counter(item) ' ';
        counter-increment: item;
        font-size: 14px;
        margin-right: 12px;
      }

      &-image {
        align-items: center;
        background-color: #f4f4f4;
        cursor: pointer;
        display: flex;
        height: 56px;
        justify-content: center;
        margin-right: 12px;
        padding: 8px;
        width: 56px;
      }

      > input[type='text'] {
        flex: 1;
      }

      &-quantity {
        align-items: center;
        background-color: #f4f4f4;
        display: flex;
        margin-left: 12px;

        > .icon.disabled {
          cursor: not-allowed;
        }

        .quantity {
          border-bottom: 1px solid #bababa;
          line-height: 1.15;
          padding: 13px 4px;
        }
      }

      .name {
        flex: 1;
      }

      > .icon {
        margin-left: 12px;
      }
    }
  }

  ${(props) =>
    !props.isEditing
      ? css`
          .header {
            display: none;
          }

          .list-item {
            > .icon {
              display: none;
            }

            &-quantity {
              background-color: transparent;

              .quantity {
                border-bottom: none;
              }

              > .icon {
                display: none;
              }
            }
          }
        `
      : null}
`;
