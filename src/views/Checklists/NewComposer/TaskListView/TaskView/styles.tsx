import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  display: grid;
  grid-template-areas: 'task task-media';
  grid-template-columns: 1.5fr 1fr;
  grid-column-gap: 16px;

  .task {
    background-color: #ffffff;
    border: 1px solid #eeeeee;
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(18, 170, 179, 0.08);
    display: grid;
    grid-template-areas: 'top-bar' 'header' 'task-content' 'completion-buttons';
    height: max-content;

    :hover {
      box-shadow: 0 8px 8px 0 rgba(153, 153, 153, 0.16);
    }

    &.active {
      border-color: #1d84ff;
    }

    &-content {
      grid-area: task-content;
    }

    &-completion-buttons {
      grid-area: completion-buttons;
      padding: 32px;
    }

    &-media {
      grid-area: task-media;
    }
  }
`;

export const HeaderWrapper = styled.div`
  border-bottom: 1px solid #dadada;
  grid-area: header;
  background-color: ${(props) =>
    !props.isEditing ? '#fafafa' : 'transparent'};

  .top-bar {
    align-items: center;
    background-color: #fafafa;
    grid-area: top-bar;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    display: flex;

    .stop-banner {
      padding: 16px 52px;
      display: flex;
      flex: 1;
      align-items: center;
      background-color: #eeeeee;

      > .icon {
        margin-right: 12px;
        color: #f2c94c;
      }

      > span {
        font-size: 14px;
        line-height: 1.43;
        letter-spacing: 1px;
        color: #000000;
      }
    }

    .position-control-buttons {
      background-color: #f4f4f4;
      border-top-left-radius: 4px;
      display: flex;
      flex-direction: column;
      margin-right: 16px;
    }

    > span {
      align-self: center;
    }

    > .icon {
      margin-left: auto;
      margin-right: 16px;
    }
  }

  .content {
    display: flex;
    padding: 32px;
    flex-direction: ${(props) => (props.isEditing ? 'column' : 'row')};

    .task {
      &-orderTree,
      &-name {
        font-size: 20px;
        color: #000000;
      }

      &-name {
        margin-left: 8px;
      }

      &-control {
        display: flex;

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
  }
`;
