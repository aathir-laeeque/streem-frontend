import { useTypedSelector } from '#store';
import { PanTool, Timer } from '@material-ui/icons';
import moment from 'moment';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Task } from '../../../checklist.types';
import { Entity, JobStatus } from '../../../types';
import { startTask } from '../../actions';

type HeaderProps = {
  task: Task;
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
          display: ${({ showStartTaskButton }) =>
            showStartTaskButton ? 'flex' : 'none'};
          font-size: 14px;
          line-height: 1.29;
          letter-spacing: 0.16px;
          margin-left: 16px;
          outline: none;
          padding: 4px 8px;
        }
      }

      .task-timer {
        align-items: center;
        display: ${({ timed }) => (timed ? 'flex' : 'none')};
        margin-top: 16px;

        > .icon {
          margin-right: 8px;
        }
      }
    }
  }
`;

const ChecklistHeader: FC<HeaderProps> = ({ task }) => {
  return <div>Checklist Header</div>;
};

const generateTimerText = (period: number) => {
  const time = moment.duration(period);

  const hours = time.hours();
  const minutes = time.minutes();
  const seconds = time.seconds();

  return `${hours
    .toString()
    .padStart(2, '0')
    .concat(' hr : ')}${minutes
    .toString()
    .padStart(2, '0')
    .concat(' min : ')}${seconds.toString().padStart(2, '0').concat(' sec')}`;
};

const JobHeader: FC<HeaderProps> = ({ task }) => {
  const dispatch = useDispatch();

  return (
    <div className="job-header">
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
        </div>

        <div className="task-timer">
          <Timer className="icon" />

          <span>Complete in NLT {generateTimerText(task.period)}</span>
        </div>
      </div>
    </div>
  );
};

const Header: FC<HeaderProps> = ({ task }) => {
  const { entity, jobStatus } = useTypedSelector((state) => state.composer);

  const showStartTaskButton = jobStatus !== JobStatus.UNASSIGNED;

  return (
    <Wrapper
      hasStop={task.hasStop}
      timed={task.timed}
      showStartTaskButton={showStartTaskButton}
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
