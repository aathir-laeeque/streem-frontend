import styled, { css } from 'styled-components';

export const Wrapper = styled.div`
  display: grid;
  grid-template-areas: 'position-control task task-media';
  grid-template-columns: 24px 1.5fr 1fr;
  grid-column-gap: 16px;

  .position-control {
    grid-area: position-control;
    display: flex;
    flex-direction: column;

    span {
      align-self: center;
    }
  }

  .task {
    background-color: #ffff;
    border: 1px solid transparent;
    border-radius: 5px;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
      0 3px 1px -2px rgba(0, 0, 0, 0.2);

    display: grid;
    grid-template-areas: 'header' 'task-content' 'completion-buttons';
    height: max-content;
    padding: 24px 16px;

    &.active {
      border-color: #1d84ff;
    }

    &-content {
      grid-area: task-content;
    }

    &-completion-buttons {
      grid-area: completion-buttons;
    }

    &-media {
      grid-area: task-media;
    }
  }
`;

export const HeaderWrapper = styled.div`
  grid-area: header;

  align-items: center;
  display: grid;

  ${(props) =>
    props.isEditing
      ? css`
          grid-template-areas: 'vacant content header-icons';
          grid-template-columns: 24px 1fr 24px;
          grid-column-gap: 16px;
        `
      : css`
          grid-template-areas: 'content';
          grid-template-columns: 1fr;
        `}

  .vacant {
    grid-area: vacant;

    ${(props) =>
      !props.isEditing
        ? css`
            display: none;
          `
        : null}
  }

  .content {
    grid-area: content;

    background-color: #f4f4f4;
    border-radius: 5px;
    display: flex;
    flex-direction: column;

    > input,
    > span {
      background-color: transparent;
      border: none;
      border-bottom: 2px solid #ddd;
      font-size: 18px;
      font-weight: 400;
      outline: none;
      padding: 16px 8px;
      width: 100%;

      :focus {
        border-bottom-color: #1d84ff;
      }
    }

    > span {
      border-bottom: none;
    }

    .task-control {
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

  .header-icons {
    grid-area: header-icons;

    ${(props) =>
      !props.isEditing
        ? css`
            display: none;
          `
        : null}
  }
`;
