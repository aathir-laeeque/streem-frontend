import { ProgressBar } from '#components';
import { Assignment, PanTool, CheckCircle, Error } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import { TaskExecutionStatus } from '../TaskList/types';
import { setActiveStage } from './actions';
import { StageCardProps } from './types';
import { useTypedSelector } from '#store/helpers';

const Wrapper = styled.div.attrs({
  className: 'stage-list-item',
})`
  background-color: #ffffff;
  border: solid 1px transparent;
  border-color: #eeeeee;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.08);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
  padding: 16px;

  .stage {
    &-header {
      align-items: center;
      display: flex;

      .stage-order {
        color: #666666;
        font-size: 12px;
      }

      .stop-icon {
        margin-left: auto;
        visibility: hidden;
      }

      .stage-badge {
        align-items: center;
        background-color: #f4f4f4;
        border-radius: 4px;
        display: flex;
        padding: 4px;

        > .icon {
          margin-right: 4px;
          color: #999999;
        }

        span {
          font-size: 12px;
          line-height: 0.83;
          color: #999999;
        }
      }
    }

    &-name {
      color: #000000;
      font-size: 14px;
      margin-top: 8px;
    }

    &-task-bar {
      margin-top: 16px;

      span {
        color: #000000;
        display: block;
        font-size: 12px;
        margin-bottom: 8px;
      }
    }
  }

  ${({ isActive }) =>
    isActive
      ? css`
          border-color: #1d84ff;
          box-shadow: 0 8px 8px 0 rgba(153, 153, 153, 0.16);
        `
      : null}

  ${({ isAnyTaskStarted, allTasksCompleted, anyTaskHasError }) => {
    if (allTasksCompleted) {
      return css`
        ${({ isActive }) =>
          isActive
            ? css`
                border-color: #5aa700;
              `
            : null}

        .stage-header {
          .stage-badge {
            background-color: #e1fec0;

            .icon,
            span {
              color: #5aa700;
            }
          }
        }

        .stage-task-bar {
          .filler {
            background-color: #5aa700;
          }
        }
      `;
    }

    if (anyTaskHasError) {
      return css`
        border-color: #ff6b6b;

        .stage-header {
          .stage-badge {
            background-color: #ffebeb;

            .icon,
            span {
              color: #ff6b6b;
            }
          }
        }

        .stage-task-bar {
          .filler {
            background-color: #ff6b6b;
          }
        }
      `;
    }

    if (isAnyTaskStarted) {
      return css`
        .stage-header {
          .stage-badge {
            background-color: #d6e9ff;

            .icon,
            span {
              color: #1d84ff;
            }
          }
        }
      `;
    }
  }}
`;

const StageCard: FC<StageCardProps> = ({ stage, isActive }) => {
  const dispatch = useDispatch();

  const { tasksById, tasksOrderInStage } = useTypedSelector(
    (state) => state.composer,
  );

  const tasks = tasksOrderInStage[stage.id].map((taskId) => tasksById[taskId]);

  const { isAnyTaskStarted, anyTaskHasError } = tasks.reduce(
    ({ isAnyTaskStarted, anyTaskHasError }, task) => {
      isAnyTaskStarted =
        isAnyTaskStarted ||
        task.taskExecution.status !== TaskExecutionStatus.NOT_STARTED;

      anyTaskHasError = anyTaskHasError || !!task.hasError;

      return { isAnyTaskStarted, anyTaskHasError };
    },
    { isAnyTaskStarted: false, anyTaskHasError: false },
  );

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) =>
      task.taskExecution.status === TaskExecutionStatus.COMPLETED ||
      task.taskExecution.status ===
        TaskExecutionStatus.COMPLETED_WITH_EXCEPTION ||
      task.taskExecution.status === TaskExecutionStatus.SKIPPED,
  ).length;

  const precentageOfCompleteTasks = Math.round(
    (completedTasks / totalTasks) * 100,
  );

  const allTasksCompleted = completedTasks === totalTasks;

  return (
    <Wrapper
      isActive={isActive}
      isAnyTaskStarted={isAnyTaskStarted}
      allTasksCompleted={allTasksCompleted}
      anyTaskHasError={anyTaskHasError}
      onClick={() => {
        if (!isActive) {
          dispatch(setActiveStage(stage.id));
        }
      }}
    >
      <div className="stage-header">
        <span className="stage-order">Stage {stage.orderTree}</span>

        <PanTool className="icon stop-icon" />

        <div className="stage-badge">
          {(() => {
            if (anyTaskHasError) {
              return (
                <>
                  <Error className="icon" />
                  <span>Task Incomplete</span>
                </>
              );
            } else if (allTasksCompleted) {
              return (
                <>
                  <CheckCircle className="icon" />
                  <span>Completed</span>
                </>
              );
            } else if (isAnyTaskStarted) {
              return (
                <>
                  <Assignment className="icon" />
                  <span>In Progress</span>
                </>
              );
            } else {
              return (
                <>
                  <Assignment className="icon" />
                  <span>Not Started</span>
                </>
              );
            }
          })()}
        </div>
      </div>

      <div className="stage-name">{stage.name}</div>

      <div className="stage-task-bar">
        <span>{precentageOfCompleteTasks}% Task completed</span>
        <ProgressBar percentage={precentageOfCompleteTasks} />
      </div>
    </Wrapper>
  );
};

export default StageCard;
