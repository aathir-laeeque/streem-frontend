import { useTypedSelector } from '#store';
import { Assignment, MoreHoriz, PanTool, Error } from '@material-ui/icons';
import { Menu, MenuItem } from '@material-ui/core';
import moment from 'moment';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import { Task } from '../../../checklist.types';
import { Entity } from '../../../types';
import { startTask } from '../../actions';
import { StartedTaskStates, TaskExecutionStatus } from '../../types';
import Timer from './Timer';
import { openModalAction } from '../../../../components/ModalContainer/actions';
import { ModalNames } from '../../../../components/ModalContainer/types';

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
      } else if (taskExecutionStatus === TaskExecutionStatus.COMPLETED) {
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
        align-items: flex-start;
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
            taskExecutionStatus === TaskExecutionStatus.COMPLETED
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
  }
`;

const ChecklistHeader: FC<HeaderProps> = ({ task }) => {
  return <div>Checklist Header</div>;
};

const generateName = ({ firstName, lastName }) => `${firstName} ${lastName}`;

const JobHeader: FC<HeaderProps> = ({ task }) => {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const {
    status,
    startedAt,
    audit: { modifiedBy },
    reason,
    correctionReason,
  } = task.taskExecution;

  return (
    <div className="job-header">
      {status in StartedTaskStates ? (
        <div className="start-audit">
          Task Started by {generateName(modifiedBy)}, ID:{' '}
          {modifiedBy.employeeId} on {moment(startedAt).format('MMM D, h:mm A')}
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

          <button
            className="start-task"
            onClick={() => dispatch(startTask(task.id))}
          >
            Start task
          </button>

          <MoreHoriz className="icon complete-options" onClick={handleClick} />

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

      {status === StartedTaskStates.SKIPPED ||
      status === StartedTaskStates.COMPLETED_WITH_EXCEPTION ? (
        <div className="skip-reason">
          <div className="badge">
            <Assignment className="icon" />
            {status === StartedTaskStates.COMPLETED_WITH_EXCEPTION
              ? 'Completed with exception'
              : 'Task Skipped'}
          </div>
          <textarea
            className="new-form-field-textarea"
            value={reason}
            disabled
            rows={4}
          />
        </div>
      ) : null}

      {status === StartedTaskStates.ENABLED_FOR_ERROR_CORRECTION ||
      (status === StartedTaskStates.COMPLETED && correctionReason) ? (
        <div className="correction-reason">
          <div className="badge">
            <Assignment className="icon" />
            Error Corretcion
          </div>
          <textarea
            className="new-form-field-textarea"
            value={correctionReason}
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
}) => {
  const { entity } = useTypedSelector((state) => state.composer);

  return (
    <Wrapper
      hasStop={task.hasStop}
      showStartButton={showStartButton}
      taskExecutionStatus={task.taskExecution.status}
      isTaskStarted={isTaskStarted}
      isTaskDelayed={isTaskDelayed}
    >
      {entity === Entity.CHECKLIST ? (
        <ChecklistHeader task={task} />
      ) : (
        <JobHeader task={task} />
      )}
    </Wrapper>
  );
};

export default Header;
