import { TaskExecutionState } from '#JobComposer/checklist.types';
import styled, { css } from 'styled-components';

type Props = {
  hasStop: boolean;
  showStartButton: boolean;
  taskExecutionState: TaskExecutionState;
  isTaskStarted: boolean;
  isTaskDelayed: boolean;
};

const Wrapper = styled.div.attrs({
  className: 'task-header',
})<Props>`
  .task-config {
    background-color: #fafafa;
    display: flex;
    flex-direction: column;
    padding: 16px;
  }

  .job-header {
    display: flex;
    flex-direction: column;

    ${({ taskExecutionState, isTaskDelayed }) => {
      if (isTaskDelayed) {
        return css`
          border-top: 4px solid #f7b500;
          border-radius: 4px;
        `;
      } else if (taskExecutionState === TaskExecutionState.COMPLETED) {
        return css`
          border-top: 4px solid #5aa700;
          border-radius: 4px;
        `;
      } else if (
        taskExecutionState === TaskExecutionState.SKIPPED ||
        taskExecutionState === TaskExecutionState.COMPLETED_WITH_EXCEPTION
      ) {
        return css`
          border-top: 4px solid #f7b500;
          border-radius: 4px;
        `;
      }
    }}

    .stop-banner {
      align-items: center;
      background-color: #eeeeee;
      justify-content: center;
      padding: 8px 16px;
      font-size: 12px;
      line-height: 1.33;
      font-weight: normal;

      display: ${({ hasStop }) => (hasStop ? 'flex' : 'none')};

      > .icon {
        margin-right: 12px;
        font-size: 16px;
        color: #f2c94c;
      }
    }

    .start-audit {
      background-color: #f4f4f4;
      padding: 8px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #999999;
    }

    .task-config {
      .wrapper {
        align-items: center;
        display: flex;

        .task-name {
          color: #000000;
          flex: 1;
          font-size: 16px;
          font-weight: bold;
          line-height: 1.25;
        }

        .start-task {
          background: transparent;
          border: 1px solid #1d84ff;
          border-radius: 4px;
          color: #1d84ff;
          cursor: pointer;
          display: ${({ showStartButton }) => (showStartButton ? 'flex' : 'none')};
          font-size: 14px;
          line-height: 1.29;
          letter-spacing: 0.16px;
          margin-left: 16px;
          outline: none;
          padding: 4px 8px;
        }

        .complete-options {
          display: ${({ taskExecutionState }) =>
            taskExecutionState === TaskExecutionState.COMPLETED ||
            taskExecutionState === TaskExecutionState.COMPLETED_WITH_EXCEPTION ||
            taskExecutionState === TaskExecutionState.SKIPPED
              ? 'flex'
              : 'none'};
        }
      }

      .task-timer {
        align-items: flex-start;
        display: flex;
        margin-top: 16px;
        justify-content: space-between;

        .timer-config {
          display: flex;

          > div {
            display: flex;
            flex-direction: column;

            span {
              color: #000000;
              font-size: 14px;
              line-height: 1.14;
              letter-spacing: 0.16px;

              :nth-child(2n) {
                margin-top: 8px;
                color: #999999;
                letter-spacing: 0.32px;
                font-size: 12px;
              }
            }
          }

          > .icon {
            margin-right: 8px;
            font-size: 16px;
          }
        }

        .timer {
          display: ${({ isTaskStarted }) => (isTaskStarted ? 'flex' : 'none')};
          flex-direction: column;
          align-items: center;
          font-size: 14px;
          line-height: 1.14;

          span {
            :first-child {
              background-color: #eeeeee;
              padding: 4px;
            }

            :nth-child(2n) {
              color: #ff6b6b;
              margin-top: 8px;
            }
          }

          &.error {
            color: #ff6b6b;
          }
        }
      }
    }

    .skip-reason {
      background-color: #fafafa;
      border-top: 1px solid #dadada;
      padding: 16px;
      display: flex;
      flex: 1;
      flex-direction: column;

      .badge {
        background-color: #f7b500;
        border-radius: 4px;
        padding: 4px;
        display: flex;
        align-items: center;
        color: #ffffff;
        width: max-content;
        margin-bottom: 16px;

        .icon {
          color: #ffffff;
          margin-right: 4px;
        }
      }

      textarea {
        border: 1px solid #dadada;
        border-radius: 4px;
      }
    }

    .correction-reason {
      background-color: #fafafa;
      border-top: 1px solid #dadada;
      padding: 16px 32px;
      display: flex;
      flex: 1;
      flex-direction: column;

      .badge {
        background-color: #333333;
        border-radius: 4px;
        padding: 4px;
        display: flex;
        align-items: center;
        color: #ffffff;
        width: max-content;
        margin-bottom: 16px;

        .icon {
          color: #ffffff;
          margin-right: 4px;
        }
      }

      textarea {
        border: 1px solid #dadada;
        border-radius: 4px;
      }
    }

    .task-assignees {
      display: flex;
      justify-content: space-between;
      padding: 4px 16px;
      align-items: center;

      @media (min-width: 1201px) {
        padding: 4px 32px;
      }

      > span {
        font-size: 14px;
        color: #999999;
      }

      > div {
        display: flex;

        .user-thumb {
          width: 32px;
          height: 32px;
          border-radius: 16px;
          border: solid 1px #fff;
          align-items: center;
          background-color: #eeeeee;
          justify-content: center;
          display: flex;
          color: #1d84ff;
          margin-right: -5px;
          font-size: 13px;
          cursor: pointer;
        }
      }
    }
  }
`;

export { Wrapper };
