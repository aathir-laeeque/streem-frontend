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
            justify-content: center;
            padding: 10px;

            :last-child {
              border-right: none;
            }

            :hover {
              > .icon {
                color: #1d84ff;
              }
            }

            > .icon {
              margin-right: 8px;
            }
          }

          ${({ hasMedias, hasStop, isTimed }) => {
            if (isTimed) {
              return css`
                #timed {
                  > .icon {
                    color: #1d84ff;
                  }
                }
              `;
            }

            if (hasStop) {
              return css`
                #add-stop {
                  > .icon {
                    color: #f7b500;
                  }
                }
              `;
            }

            if (hasMedias) {
              return css`
                #attach-media {
                  > .icon {
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
`;

export { TaskListWrapper, TaskCardWrapper, TaskMediasWrapper };
