import { openModalAction } from '#components/ModalContainer/actions';
import { ModalNames } from '#components/ModalContainer/types';
import { Task, TaskExecutionStatus } from '#Composer/checklist.types';
import { ArrowRightAlt, CheckCircle, Error } from '@material-ui/icons';
import moment from 'moment';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import {
  cancelErrorCorretcion,
  completeErrorCorretcion,
  completeTask,
} from '../../actions';

const Wrapper = styled.div.attrs({
  className: 'task-buttons',
})`
  display: flex;
  flex-direction: column;
  padding: 0 32px 32px;

  button {
    align-items: center;
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    outline: none;
  }

  .complete-task {
    border: 1px solid #1d84ff;
    border-radius: 4px;
    color: #1d84ff;
    padding: 10px 0;

    > .icon {
      color: #1d84ff;
      margin-left: 12px;
    }
  }

  .skip-task {
    color: #1d84ff;
    margin-top: 24px;
  }

  .error-badge {
    align-items: center;
    color: #ff6b6b;
    display: flex;
    font-size: 12px;
    justify-content: center;
    margin-top: 16px;
  }
`;

const DelayWrapper = styled.div`
  display: flex;
  padding: 32px;
  flex-direction: column;

  .buttons-container {
    margin-top: 16px;

    button {
      border: 1px solid transparent;
      outline: none;
      padding: 10px 24px;
      background: transparent;

      :first-child {
        border-color: #1d84ff;
        color: #1d84ff;
      }

      :last-child {
        margin-left: 24px;
        border-color: #ff6b6b;
        color: #ff6b6b;
      }
    }
  }
`;

const CompletedWrapper = styled.div.attrs({
  className: '',
})`
  align-items: center;
  ${({ completed, skipped, isTaskDelayed }) => {
    if (completed) {
      if (isTaskDelayed) {
        return css`
          background-color: #f7b500;
        `;
      }
      return css`
        background-color: #5aa700;
      `;
    } else if (skipped) {
      return css`
        background-color: #f7b500;
      `;
    }
  }}
  color: #ffffff;
  display: flex;
  justify-content: center;
  padding: 16px 0;

  > .icon {
    color: #ffffff;
    margin-right: 8px;
    opacity: 0.5;
  }

  .task-off-limit-reason {
    background-color: rgba(247, 181, 0, 0.08);
    padding: 16px 32px;

    textarea {
      font-size: 12px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      color: #000000;
    }
  }
`;

const DelayedWrapper = styled.div`
  display: flex;
  flex-direction: column;

  background-color: rgba(247, 181, 0, 0.08);

  .task-off-limit-reason {
    padding: 16px 32px;

    textarea {
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      padding: 16px;
      font-size: 14px;
      color: #000000;
      resize: none;
      width: 100%;
    }
  }
`;

type FooterProps = {
  canSkipTask: boolean;
  task: Omit<Task, 'activities'>;
};

const generateName = ({ firstName, lastName }) => `${firstName} ${lastName}`;

const Footer: FC<FooterProps> = ({ canSkipTask, task, activitiesHasError }) => {
  const dispatch = useDispatch();

  const [shouldAskForReason, setAskForReason] = useState(false);
  const [delayReason, setDelayReason] = useState('');

  const {
    audit: { modifiedBy, modifiedAt },
    status: taskExecutionStatus,
    reason,
  } = task.taskExecution;

  const isTaskDelayed =
    taskExecutionStatus === TaskExecutionStatus.COMPLETED && reason;

  if (
    taskExecutionStatus === TaskExecutionStatus.COMPLETED ||
    taskExecutionStatus === TaskExecutionStatus.COMPLETED_WITH_ERROR_CORRECTION
  ) {
    if (isTaskDelayed) {
      let text;
      if (
        moment().diff(moment(task.taskExecution.startedAt)) > task.maxPeriod
      ) {
        text = 'after the set time';
      } else if (
        task.timerOperator === 'NOT_LESS_THAN' &&
        moment().diff(moment(task.taskExecution.startedAt)) < task.minPeriod
      ) {
        text = 'before the set time';
      }

      return (
        <DelayedWrapper>
          <CompletedWrapper completed isTaskDelayed={isTaskDelayed}>
            <Error className="icon" />
            <span>
              Task Completed {text} by {generateName(modifiedBy)}, ID:{' '}
              {modifiedBy.employeeId} on{' '}
              {moment(modifiedAt).format('MMM D, h:mm A')}
            </span>
          </CompletedWrapper>
          {reason ? (
            <div className="task-off-limit-reason">
              <textarea value={reason} rows={4} disabled />
            </div>
          ) : null}
        </DelayedWrapper>
      );
    } else {
      return (
        <CompletedWrapper completed>
          <CheckCircle className="icon" />
          <span>
            Task Completed by {generateName(modifiedBy)}, ID:{' '}
            {modifiedBy.employeeId} on{' '}
            {moment(modifiedAt).format('MMM D, h:mm A')}
          </span>
        </CompletedWrapper>
      );
    }
  } else if (taskExecutionStatus === TaskExecutionStatus.SKIPPED) {
    return (
      <CompletedWrapper skipped>
        <CheckCircle className="icon" />
        <span>
          Task skipped by {generateName(modifiedBy)}, ID:{' '}
          {modifiedBy.employeeId} on{' '}
          {moment(modifiedAt).format('MMM D, h:mm A')}
          {}
        </span>
      </CompletedWrapper>
    );
  } else if (task.taskExecution.status === TaskExecutionStatus.INPROGRESS) {
    if (shouldAskForReason) {
      let text;
      if (
        moment().diff(moment(task.taskExecution.startedAt)) > task.maxPeriod
      ) {
        text = 'State your reason for delay';
      } else if (
        task.timerOperator === 'NOT_LESS_THAN' &&
        moment().diff(moment(task.taskExecution.startedAt)) < task.minPeriod
      ) {
        text = 'State your reason for early completion';
      }
      return (
        <DelayWrapper>
          <div className="new-form-field">
            <label className="new-form-field-label">{text}</label>
            <textarea
              className="new-form-field-textarea"
              name="reason"
              value={delayReason}
              rows={4}
              onChange={(e) => setDelayReason(e.target.value)}
            />
          </div>
          <div className="buttons-container">
            <button
              onClick={() => dispatch(completeTask(task.id, delayReason))}
            >
              Submit
            </button>
            <button
              onClick={() => {
                setDelayReason('');
                setAskForReason(false);
              }}
            >
              Cancel
            </button>
          </div>
        </DelayWrapper>
      );
    } else {
      return (
        <Wrapper>
          <button
            className="complete-task"
            onClick={() => {
              const timeElapsed = moment().diff(
                moment(task.taskExecution.startedAt),
              );

              if (
                task.timed &&
                (timeElapsed > task.maxPeriod ||
                  (task.timerOperator === 'NOT_LESS_THAN' &&
                    timeElapsed < task.minPeriod))
              ) {
                setAskForReason(true);
              } else {
                dispatch(completeTask(task.id));
              }
            }}
          >
            Complete Task <ArrowRightAlt className="icon" />
          </button>

          <button
            className="skip-task"
            onClick={() => {
              if (canSkipTask) {
                dispatch(
                  openModalAction({
                    type: ModalNames.SKIP_TASK_MODAL,
                    props: { taskId: task.id },
                  }),
                );
              } else {
                dispatch(
                  openModalAction({
                    type: ModalNames.COMPLETE_TASK_WITH_EXCEPTION,
                    props: { taskId: task.id },
                  }),
                );
              }
            }}
          >
            {canSkipTask ? 'Skip the task' : 'Complete with Exception'}
          </button>

          {activitiesHasError ? (
            <div className="error-badge">
              Mandatory Activity is incomplete, you cannot complete this Task,
            </div>
          ) : null}
        </Wrapper>
      );
    }
  } else if (
    task.taskExecution.status ===
    TaskExecutionStatus.ENABLED_FOR_ERROR_CORRECTION
  ) {
    return (
      <div
        className="buttons-container"
        style={{ display: 'flex', padding: '0 32px 32px' }}
      >
        <button
          style={{
            border: '1px solid #5ca6ff',
            color: '#5ca6ff',
            outline: 'none',
            padding: '10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            background: 'transparent',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => dispatch(completeErrorCorretcion(task.id))}
        >
          Confirm
        </button>
        <button
          style={{
            border: '1px solid #ff6b6b',
            color: '#ff6b6b',
            outline: 'none',
            padding: '10px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            marginLeft: '24px',
            borderRadius: '4px',
            background: 'transparent',
            cursor: 'pointer',
          }}
          onClick={() => dispatch(cancelErrorCorretcion(task.id))}
        >
          Cancel
        </button>
      </div>
    );
  }

  return null;
};

export default Footer;
