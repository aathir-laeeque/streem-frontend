import styled, { css } from 'styled-components';

export const Wrapper = styled.div.attrs({
  className: 'list-item',
})`
  display: grid;
  grid-template-areas: 'task task-media';
  grid-template-columns: 1.5fr 1fr;
  grid-column-gap: 16px;
  margin-bottom: 24px;

  .task {
    background-color: #ffffff;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(18, 170, 179, 0.08);
    display: flex;
    flex-direction: column;
    grid-area: task;
    height: max-content;

    :hover {
      box-shadow: 0 8px 8px 0 rgba(153, 153, 153, 0.16);
    }

    &.active {
      border-color: #1d84ff;
    }
  }
`;

export const HeaderWrapper = styled.div.attrs({
  className: 'task-header',
})`
  border-bottom: 1px solid #dadada;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  display: flex;
  flex-direction: column;

  .task {
    &-controller {
      align-items: center;
      background-color: #fafafa;

      display: ${({ isEditing }) => (isEditing ? 'flex' : 'none')};

      .position-control-buttons {
        background-color: #f4f4f4;
        display: flex;
        flex-direction: column;
        margin-right: 16px;
      }

      .delete-task {
        margin-left: auto;
        margin-right: 16px;
      }
    }
  }

  .stop-banner {
    align-items: center;
    background-color: #eeeeee;
    justify-content: center;
    padding: 16px 0;

    display: ${({ isEditing, hasStop }) =>
      isEditing ? 'none' : hasStop ? 'flex' : 'none'};

    > .icon {
      margin-right: 12px;
      color: #f2c94c;
    }
  }

  .task {
    &-config {
      display: flex;
      flex-direction: column;
      padding: 32px;

      ${({ isEditing }) =>
        !isEditing
          ? css`
              background-color: #fafafa;
            `
          : null}
    }

    &-timer {
      display: flex;
      margin-top: 12px;
      align-items: center;
      font-size: 14px;

      > .icon {
        margin-right: 12px;
        #color: #1d84ff;
      }
    }

    &-name {
      ${({ isEditing }) =>
        isEditing
          ? css`
              .task-name,
              .task-orderTree {
                display: none;
              }
            `
          : css`
              .new-form-field {
                display: none;
              }

              .task-name,
              .task-orderTree {
                font-size: 20px;
                color: #000000;
              }

              .task-name {
                margin-left: 16px;
              }
            `}
    }

    &-control {
      display: ${({ isEditing }) => (isEditing ? 'flex' : 'none')};

      &-item {
        align-items: center;
        border-right: 1px solid #dadada;
        cursor: pointer;
        display: flex;
        flex: 1;
        justify-content: center;
        padding: 8px 16px;

        :last-child {
          border-right: none;
        }

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

        &.active {
          > svg {
            color: #1d84ff;
          }

          > span {
            color: #1d84ff;
          }
        }
      }
    }
  }
`;

export const FooterWrapper = styled.div.attrs({
  className: 'task-buttons',
})`
  display: flex;
  flex-direction: column;
  padding: 32px;

  button {
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    outline: none;
  }

  .complete-task {
    border: 1px solid #1d84ff;
    border-radius: 4px;
    color: #1d84ff;
    padding: 10px 0;

    > .icon {
      color: #1d84ff;
      margin-left: 12px;
    }
  }

  .skip-task {
    color: #1d84ff;
    margin-top: 24px;
  }

  ${({ isEditing }) =>
    isEditing
      ? css`
          .complete-task,
          .skip-task {
            display: none;
          }
        `
      : css`
          .add-new-activity {
            display: none;
          }
        `}
`;
