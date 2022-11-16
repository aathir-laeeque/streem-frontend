import styled, { css } from 'styled-components';
import { TaskCardWrapperProps } from './types';

const TaskListWrapper = styled.div.attrs({
  className: 'task-list-container',
})`
  grid-area: task-list;
  overflow: auto;
  padding-right: 16px;

  .task-list-item {
    margin-bottom: 16px;
  }
`;

const TaskCardWrapper = styled.div.attrs({
  className: 'task-card',
})<TaskCardWrapperProps>`
  background-color: #ffffff;
  border: solid 1px #eeeeee;
  box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.08);
  display: flex;
  flex-direction: column;
  height: max-content;
  position: relative;

  ${({ isActive }) =>
    isActive
      ? css`
          border-color: #1d84ff;
        `
      : null}

  .overlap {
    height: 100%;
    position: absolute;
    width: 100%;
    z-index: 99;
  }

  .task {
    &-header {
      align-items: center;
      background-color: #fff;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border-bottom: 1px solid #f4f4f4;
      display: flex;

      .order-control {
        background-color: #f4f4f4;
        border-top-left-radius: 4px;
        display: flex;
        flex-direction: column;
        margin-right: 16px;
        padding: 4px;
      }

      #task-delete {
        margin-left: auto;
        margin-right: 16px;
      }

      .task-name {
        color: #000000;
        font-size: 20px;
        font-weight: bold;

        @media (max-width: 1200px) {
          font-size: 14px;
        }
      }

      svg {
        color: #161616;
      }
    }

    &-body {
      .task-config {
        border-bottom: 1px solid #dadada;
        padding: 24px 24px 0;

        @media (max-width: 1200px) {
          padding: 12px;
        }

        &-control {
          display: flex;

          &-item {
            align-items: center;
            border-right: 1px solid #eeeeee;
            cursor: pointer;
            display: flex;
            flex: 1;
            flex-direction: column;
            padding: 10px;

            @media (max-width: 1200px) {
              padding: 8px;
              font-size: 12px;
            }

            :last-child {
              border-right: none;
            }

            :hover {
              .icon {
                color: #1d84ff;
              }
            }

            > div {
              align-items: center;
              display: flex;
            }

            .timer-config {
              display: flex;
              flex-direction: column;
              margin-top: 8px;
            }

            .icon {
              margin-right: 8px;

              @media (max-width: 1200px) {
                font-size: 14px;
              }
            }
          }

          ${({ hasMedias }) => {
            if (hasMedias) {
              return css`
                #attach-media {
                  .icon {
                    color: #1d84ff;
                  }
                }
              `;
            }
          }}

          ${({ hasStop }) => {
            if (hasStop) {
              return css`
                #add-stop {
                  .icon {
                    color: #f7b500;
                  }
                }
              `;
            }
          }}

          ${({ isTimed }) => {
            if (isTimed) {
              return css`
                #timed {
                  .icon {
                    color: #1d84ff;
                  }
                }
              `;
            }
          }}
        }
      }

      .media-list {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        border-bottom: 1px solid #dadada;
        max-height: 186px;

        .icon {
          color: #161616;
          font-size: 28px;
        }

        &-items {
          display: flex;
          flex: 1;
          overflow-x: auto;
          padding-block: 16px;
        }

        &-item {
          border: 1px solid #eeeeee;
          border-radius: 5px;
          box-sizing: border-box;
          cursor: pointer;
          min-height: 150px;
          position: relative;
          margin-right: 16px;
          min-width: 250px;

          &-name {
            color: #ffffff;
            font-size: 12px;
            left: 8px;
            position: absolute;
            top: 8px;
            padding: 2px 6px;
            background-color: rgba(0, 0, 0, 0.3);
          }

          :last-child {
            margin-right: 0;
          }
        }
      }

      .activity-list {
        display: flex;
        flex-direction: column;
      }
    }

    &-error {
      color: #eb5757;
      padding: 24px;
    }

    &-footer {
      border-top: 1px solid #dadada;
      padding: 24px;

      @media (max-width: 1200px) {
        padding: 16px;
      }
    }
  }
`;

const TaskMediasWrapper = styled.div`
  .container {
    background-color: #ffffff;
    border: solid 1px #eeeeee;
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.08);
    padding: 24px;

    @media (max-width: 1200px) {
      padding: 12px;
    }

    .active-media {
      border: solid 2px #1d84ff;
      border-radius: 5px;
      cursor: pointer;
      height: 300px;
      position: relative;

      @media (max-width: 1200px) {
        height: 250px;
      }

      &-name {
        color: #ffffff;
        font-size: 12px;
        left: 12px;
        position: absolute;
        top: 32px;
        width: 56px;
      }

      img {
        border-radius: 5px;
        height: 100%;
        width: 100%;
      }
    }

    .media-list {
      align-items: center;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 16px;

      .icon {
        background-color: #f4f4f4;
        border-radius: 50%;

        :first-of-type {
          margin-right: 8px;
        }

        :last-of-type {
          margin-left: 8px;
        }
      }

      &-item {
        border: 1px solid #eeeeee;
        border-radius: 5px;
        box-sizing: border-box;
        cursor: pointer;
        height: 100px;
        position: relative;
        width: 26%;

        &-img {
          border-radius: 5px;
          height: 100%;
          width: 100%;
        }

        &-name {
          color: #ffffff;
          font-size: 12px;
          left: 8px;
          position: absolute;
          top: 8px;
        }

        :nth-child(3n) {
          margin-right: 0;
        }

        &.active {
          border-color: #1d84ff;
        }
      }
    }

    .upload-image {
      align-items: center;
      border: 1px solid #1d84ff;
      border-radius: 4px;
      display: flex;
      justify-content: center;
      margin-top: 16px;
      padding: 12px;

      .icon {
        color: #1d84ff;
        margin-right: 4px;
      }

      span {
        color: #1d84ff;
      }
    }
  }
`;

const AddActivityItemWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7.5px 12px;
  background-color: #f4f4f4;
  border-bottom: 1px solid #bababa;
  color: #808ba5;

  :hover {
    border-bottom: 1px solid #005dcc;
  }

  .label {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

export { TaskListWrapper, TaskCardWrapper, TaskMediasWrapper, AddActivityItemWrapper };
