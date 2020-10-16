import styled, { css } from 'styled-components';
import { TaskCardWrapperProps } from './types';

const TaskListWrapper = styled.div.attrs({
  className: 'task-list-container',
})`
  grid-area: task-list;
  overflow: auto;

  .task-list-item {
    display: grid;
    grid-template-areas: 'task-card task-medias';
    grid-template-columns: 2fr 1fr;
    grid-gap: 16px;
    margin-bottom: 16px;
  }
`;

const TaskCardWrapper = styled.div.attrs({
  className: 'task-card',
})<TaskCardWrapperProps>`
  background-color: #ffffff;
  border: solid 1px #eeeeee;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.08);
  display: flex;
  flex-direction: column;
  grid-area: task-card;

  .task {
    &-header {
      align-items: center;
      background-color: #fafafa;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
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
      }
    }

    &-body {
      .task-config {
        border-bottom: 1px solid #dadada;
        padding: 32px;

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
            }
          }

          ${({ hasMedias, hasStop, isTimed }) => {
            if (isTimed) {
              return css`
                #timed {
                  .icon {
                    color: #1d84ff;
                  }
                }
              `;
            }

            if (hasStop) {
              return css`
                #add-stop {
                  .icon {
                    color: #f7b500;
                  }
                }
              `;
            }

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
        }
      }

      .activity-list {
        display: flex;
        flex-direction: column;
      }
    }

    &-footer {
      border-top: 1px solid #dadada;
      padding: 32px;
    }
  }
`;

const TaskMediasWrapper = styled.div`
  grid-area: task-medias;

  .container {
    background-color: #ffffff;
    border: solid 1px #eeeeee;
    border-radius: 4px;
    box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.08);
    padding: 24px;

    .active-media {
      border: solid 2px #1d84ff;
      border-radius: 5px;
      cursor: pointer;
      height: 300px;
      position: relative;

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
          margin-right: 16px;
        }

        :last-of-type {
          margin-left: 16px;
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
      /* cursor: pointer; */
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
        /* cursor: pointer; */
      }
    }
  }
`;

export { TaskListWrapper, TaskCardWrapper, TaskMediasWrapper };
