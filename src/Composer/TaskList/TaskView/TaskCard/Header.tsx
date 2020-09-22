import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';
import { openPopoverAction } from '#components/PopoverContainer/actions';
import { PopoverNames } from '#components/PopoverContainer/types';
import { getInitials } from '#utils/stringUtils';
import {
  StartedTaskStates,
  Task,
  TaskExecutionStatus,
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
import { User, Users } from '#store/users/types';

type HeaderProps = {
  task: Omit<Task, 'activities'>;
  showStartButton: boolean;
};

const Wrapper = styled.div.attrs({
  className: 'task-header',
})`
  .task-config {
    background-color: #fafafa;
    display: flex;
    flex-direction: column;
    padding: 32px;
  }

  .job-header {
    display: flex;
    flex-direction: column;

    ${({ taskExecutionStatus, isTaskDelayed }) => {
      if (isTaskDelayed) {
        return css`
          border-top: 4px solid #f7b500;
          border-radius: 4px;
        `;
      } else if (
        taskExecutionStatus === TaskExecutionStatus.COMPLETED ||
        taskExecutionStatus ===
          TaskExecutionStatus.COMPLETED_WITH_ERROR_CORRECTION
      ) {
        return css`
          border-top: 4px solid #5aa700;
          border-radius: 4px;
        `;
      } else if (
        taskExecutionStatus === TaskExecutionStatus.SKIPPED ||
        taskExecutionStatus === TaskExecutionStatus.COMPLETED_WITH_EXCEPTION
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
          display: ${({ taskExecutionStatus }) =>
            taskExecutionStatus === TaskExecutionStatus.COMPLETED ||
            taskExecutionStatus ===
              TaskExecutionStatus.COMPLETED_WITH_ERROR_CORRECTION
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

const generateName = ({ firstName, lastName }) => `${firstName} ${lastName}`;

const JobHeader: FC<HeaderProps> = ({ task, enableStopForTask }) => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAssigneeClick = (event: MouseEvent, users: Users) => {
    dispatch(
      openPopoverAction({
        type: PopoverNames.ASSIGNED_USER_DETAIL,
        popOverAnchorEl: event.currentTarget,
        props: {
          users,
        },
      }),
    );
  };

  const {
    status,
    startedAt,
    audit: { modifiedBy },
    reason,
    correctionReason,
    assignees,
  } = task.taskExecution;
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
                onClick={(e) => handleAssigneeClick(e, [user])}
              >
                {getInitials(`${user.firstName} ${user.lastName}`)}
              </div>
            ))}
            {assignees.length > 4 && (
              <div
                key={`assignee_length`}
                className="user-thumb"
                onClick={(e) => handleAssigneeClick(e, assignees.slice(4))}
              >
                +{assignees.length - 4}
              </div>
            )}
          </div>
        </div>
      )}
      {status in StartedTaskStates ? (
        <div className="start-audit">
          Task Started by {generateName(modifiedBy)}, ID:{' '}
          {modifiedBy.employeeId} on{' '}
          {formatDateTime(startedAt, 'MMM D, h:mm:ss A')}
        </div>
      ) : null}

      <div className="stop-banner">
        <PanTool className="icon" />

        <span>Complete this task before proceeding to the next task.</span>
      </div>

      <div className="task-config">
        <div className="wrapper">
          <div className="task-name">
            {task.orderTree}. {task.name}
          </div>

          <TaskAssignmentContent taskId={task.id} />

          <button
            className="start-task"
            onClick={() => {
              console.log('enableStopForTask :: ', enableStopForTask);
              if (enableStopForTask) {
                dispatch(
                  openModalAction({ type: ModalNames.ADD_STOP, props: {} }),
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
                  openModalAction({
                    type: ModalNames.TASK_ERROR_CORRECTION,
                    props: { taskId: task.id },
                  }),
                );
              }}
            >
              <Error className="icon" />
              Error correction
            </MenuItem>
          </Menu>
        </div>

        {task.timed ? <Timer task={task} /> : null}
      </div>

      {status === TaskExecutionStatus.SKIPPED ||
      status === TaskExecutionStatus.COMPLETED_WITH_EXCEPTION ? (
        <div className="skip-reason">
          <div className="badge">
            <Assignment className="icon" />
            {status === TaskExecutionStatus.COMPLETED_WITH_EXCEPTION
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

      {status === TaskExecutionStatus.ENABLED_FOR_ERROR_CORRECTION ||
      status === TaskExecutionStatus.COMPLETED_WITH_ERROR_CORRECTION ? (
        <div className="correction-reason">
          <div className="badge">
            <Assignment className="icon" />
            Error Corretcion
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
}) => {
  return (
    <Wrapper
      hasStop={task.hasStop}
      showStartButton={showStartButton}
      taskExecutionStatus={task.taskExecution.status}
      isTaskStarted={isTaskStarted}
      isTaskDelayed={isTaskDelayed}
    >
      <JobHeader task={task} enableStopForTask={enableStopForTask} />
    </Wrapper>
  );
};

export default Header;
