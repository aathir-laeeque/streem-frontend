import { Task } from '#Composer/checklist.types';
import { ArrowRightAlt, CheckCircle } from '@material-ui/icons';
import moment from 'moment';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled, { css } from 'styled-components';

import { completeTask, skipTask } from '../../actions';
import { TaskExecutionStatus } from '../../types';

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

const CompletedWrapper = styled.div.attrs({
  className: '',
})`
  align-items: center;
  ${({ completed, skipped }) => {
    if (completed) {
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
`;

type FooterProps = {
  canSkipTask: boolean;
  task: Omit<Task, 'activities'>;
};

const generateName = ({ firstName, lastName }) => `${firstName} ${lastName}`;

const Footer: FC<FooterProps> = ({ canSkipTask, task, activitiesHasError }) => {
  const dispatch = useDispatch();

  const {
    audit: { modifiedBy, modifiedAt },
    status: taskExecutionStatus,
  } = task.taskExecution;

  if (taskExecutionStatus === TaskExecutionStatus.COMPLETED) {
    return (
      <CompletedWrapper completed>
        <CheckCircle className="icon" />
        <span>
          Task Completed by {generateName(modifiedBy)}, ID: {modifiedBy.id} on{' '}
          {moment(modifiedAt).format('MMM D, h:mm A')}
          {}
        </span>
      </CompletedWrapper>
    );
  } else if (taskExecutionStatus === TaskExecutionStatus.SKIPPED) {
    return (
      <CompletedWrapper skipped>
        <CheckCircle className="icon" />
        <span>
          Task skipped by {generateName(modifiedBy)}, ID: {modifiedBy.id} on{' '}
          {moment(modifiedAt).format('MMM D, h:mm A')}
          {}
        </span>
      </CompletedWrapper>
    );
  } else if (task.taskExecution.status === TaskExecutionStatus.INPROGRESS) {
    return (
      <Wrapper>
        <button
          className="complete-task"
          onClick={() => dispatch(completeTask(task.id))}
        >
          Complete Task <ArrowRightAlt className="icon" />
        </button>

        <button
          className="skip-task"
          onClick={() => dispatch(skipTask(task.id))}
        >
          {canSkipTask ? 'Skip the task' : 'Force close task'}
        </button>

        {activitiesHasError ? (
          <div className="error-badge">
            Mandatory Activity is incomplete, you cannot complete this Task,
          </div>
        ) : null}
      </Wrapper>
    );
  }

  return null;
};

export default Footer;
