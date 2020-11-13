import {
  openOverlayAction,
  closeOverlayAction,
} from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { getInitials } from '#utils/stringUtils';
import {
  StartedTaskStates,
  Task,
  TaskExecutionState,
} from '#Composer/checklist.types';
import { formatDateTime } from '#utils/timeUtils';
import { Menu, MenuItem } from '@material-ui/core';
import { Assignment, Error, MoreHoriz, PanTool } from '@material-ui/icons';
import React, { FC, MouseEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import { startTask } from '../../actions';
import Timer from './Timer';
import TaskAssignmentContent from './TaskAssignmentContent';
import { User } from '#store/users/types';
import { useTypedSelector } from '#store';
import { capitalize } from 'lodash';

type HeaderProps = {
  task: Omit<Task, 'activities'>;
  showStartButton: boolean;
  isTaskStarted: boolean;
  isTaskDelayed: boolean;
  enableStopForTask: boolean;
  showAssignmentButton: boolean;
};

const Wrapper = styled.div.attrs({
  className: 'task-header',
})<{
  hasStop: boolean;
  showStartButton: boolean;
  taskExecutionState: TaskExecutionState;
  isTaskStarted: boolean;
  isTaskDelayed: boolean;
}>`
  .task-config {
    background-color: #fafafa;
    display: flex;
    flex-direction: column;
    padding: 32px;
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
      } else if (
        taskExecutionState === TaskExecutionState.COMPLETED ||
        taskExecutionState === TaskExecutionState.COMPLETED_WITH_CORRECTION
      ) {
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
      padding: 16px 0;

      display: ${({ hasStop }) => (hasStop ? 'flex' : 'none')};

      > .icon {
        margin-right: 12px;
        color: #f2c94c;
      }
    }

    .start-audit {
      background-color: #f4f4f4;
      padding: 12px 0;
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
          font-size: 20px;
        }

        .start-task {
          background: transparent;
          border: 1px solid #1d84ff;
          border-radius: 4px;
          color: #1d84ff;
          cursor: pointer;
          display: ${({ showStartButton }) =>
            showStartButton ? 'flex' : 'none'};
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
            taskExecutionState === TaskExecutionState.COMPLETED_WITH_CORRECTION
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

              :nth-child(2n) {
                margin-top: 8px;
                color: #999999;
              }
            }
          }

          > .icon {
            margin-right: 8px;
          }
        }

        .timer {
          display: ${({ isTaskStarted }) => (isTaskStarted ? 'flex' : 'none')};
          flex-direction: column;
          align-items: center;

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
      padding: 16px 32px;
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
      padding: 4px 32px;
      align-items: center;

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

const generateName = ({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) => `${firstName} ${lastName}`;

const JobHeader: FC<Pick<
  HeaderProps,
  'task' | 'enableStopForTask' | 'showAssignmentButton'
>> = ({ task, enableStopForTask, showAssignmentButton }) => {
  const dispatch = useDispatch();
  const { profile } = useTypedSelector((state) => state.auth);

  const { activeStageId, stagesOrder } = useTypedSelector(
    (state) => state.composer.stages,
  );

  const stageIndex = stagesOrder.indexOf(activeStageId);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAssigneeClick = (event: MouseEvent, users: User[]) => {
    dispatch(
      openOverlayAction({
        type: OverlayNames.ASSIGNED_USER_DETAIL,
        popOverAnchorEl: event.currentTarget,
        props: {
          users,
        },
      }),
    );
  };

  const {
    state,
    startedAt,
    audit: { modifiedBy },
    reason,
    correctionReason,
    assignees,
  } = task.taskExecution;

  const isUserAssignedToTask = assignees.some(
    (user) => user.id === profile?.id,
  );

  return (
    <div className="job-header">
      {assignees && assignees.length > 0 && (
        <div className="task-assignees">
          <span>This Task’s Assignees</span>
          <div>
            {assignees.slice(0, 4).map((user) => (
              <div
                key={`assignee_${user.id}`}
                className="user-thumb"
                aria-haspopup="true"
                onMouseEnter={(e) => handleAssigneeClick(e, [user])}
                onMouseLeave={() =>
                  dispatch(
                    closeOverlayAction(OverlayNames.ASSIGNED_USER_DETAIL),
                  )
                }
              >
                {capitalize(user.firstName).substring(0, 1)}
                {capitalize(user.lastName).substring(0, 1)}
              </div>
            ))}
            {assignees.length > 4 && (
              <div
                key={`assignee_length`}
                className="user-thumb"
                aria-haspopup="true"
                onMouseEnter={(e) => handleAssigneeClick(e, assignees.slice(4))}
                onMouseLeave={() =>
                  dispatch(
                    closeOverlayAction(OverlayNames.ASSIGNED_USER_DETAIL),
                  )
                }
              >
                +{assignees.length - 4}
              </div>
            )}
          </div>
        </div>
      )}
      {state in StartedTaskStates && startedAt ? (
        <div className="start-audit">
          Task Started by {generateName(modifiedBy)}, ID:{' '}
          {modifiedBy.employeeId} on{' '}
          {formatDateTime(startedAt, 'MMM D, YYYY h:mm A')}
        </div>
      ) : null}

      <div className="stop-banner">
        <PanTool className="icon" />

        <span>Complete this task before proceeding to the next task.</span>
      </div>

      <div className="task-config">
        <div className="wrapper">
          <div className="task-name">
            {stageIndex + 1}.{task.orderTree}. {task.name}
          </div>
          {showAssignmentButton && <TaskAssignmentContent taskId={task.id} />}

          {isUserAssignedToTask && (
            <>
              <button
                className="start-task"
                onClick={() => {
                  if (enableStopForTask) {
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.ADD_STOP,
                        props: {},
                      }),
                    );
                  } else {
                    dispatch(startTask(task.id));
                  }
                }}
              >
                Start task
              </button>
              <div onClick={handleClick}>
                <MoreHoriz className="icon complete-options" />
              </div>

              <Menu
                id="task-error-correction"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                style={{ marginTop: 30 }}
              >
                <MenuItem
                  onClick={() => {
                    handleClose();
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.TASK_ERROR_CORRECTION,
                        props: { taskId: task.id },
                      }),
                    );
                  }}
                >
                  <Error className="icon" />
                  Error correction
                </MenuItem>
              </Menu>
            </>
          )}
        </div>

        {task.timed ? <Timer task={task} /> : null}
      </div>

      {state === TaskExecutionState.SKIPPED ||
      state === TaskExecutionState.COMPLETED_WITH_EXCEPTION ? (
        <div className="skip-reason">
          <div className="badge">
            <Assignment className="icon" />
            {state === TaskExecutionState.COMPLETED_WITH_EXCEPTION
              ? 'Completed with exception'
              : 'Task Skipped'}
          </div>
          <textarea
            className="new-form-field-textarea"
            value={reason ?? undefined}
            disabled
            rows={4}
          />
        </div>
      ) : null}

      {state === TaskExecutionState.ENABLED_FOR_CORRECTION ||
      state === TaskExecutionState.COMPLETED_WITH_CORRECTION ? (
        <div className="correction-reason">
          <div className="badge">
            <Assignment className="icon" />
            Error Correction
          </div>
          <textarea
            className="new-form-field-textarea"
            value={correctionReason ?? undefined}
            disabled
            rows={4}
          />
        </div>
      ) : null}
    </div>
  );
};

const Header: FC<HeaderProps> = ({
  task,
  showStartButton,
  isTaskStarted,
  isTaskDelayed,
  enableStopForTask,
  showAssignmentButton,
}) => {
  return (
    <Wrapper
      hasStop={task.hasStop}
      showStartButton={showStartButton}
      taskExecutionState={task.taskExecution.state}
      isTaskStarted={isTaskStarted}
      isTaskDelayed={isTaskDelayed}
    >
      <JobHeader
        task={task}
        enableStopForTask={enableStopForTask}
        showAssignmentButton={showAssignmentButton}
      />
    </Wrapper>
  );
};

export default Header;
