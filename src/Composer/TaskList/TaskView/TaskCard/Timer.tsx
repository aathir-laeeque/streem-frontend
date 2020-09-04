import { Timer as TimerIcon } from '@material-ui/icons';
import React, { FC, useState, useEffect } from 'react';
import moment from 'moment';
import { TaskExecutionStatus } from '../../types';

const formatTime = (period: number) => {
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

const Timer: FC = ({ task }) => {
  const [timeElapsed, setTimeElapsed] = useState(
    moment().diff(moment(task.taskExecution.startedAt)),
  );

  const [isLimitCrossed, setLimitCrossed] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined;

    if (task.taskExecution.status === TaskExecutionStatus.INPROGRESS) {
      interval = setInterval(() => {
        setTimeElapsed(moment().diff(moment(task.taskExecution.startedAt)));
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [task]);

  useEffect(() => {
    if (timeElapsed > task.maxPeriod) {
      setLimitCrossed(true);
    }
  }, [timeElapsed]);

  return (
    <div className="task-timer">
      <div className="timer-config">
        <TimerIcon className="icon" />

        <div>
          {task.timerOperator === 'NOT_LESS_THAN' ? (
            <>
              <span>Perform task in NLT {formatTime(task.minPeriod)}</span>
              <span>Max Time limit - {formatTime(task.maxPeriod)}</span>
            </>
          ) : (
            <span>Complete under {formatTime(task.maxPeriod)}</span>
          )}
        </div>
      </div>

      <div className={`timer ${isLimitCrossed ? 'error' : ''}`}>
        <span>{formatTime(timeElapsed)}</span>
        {isLimitCrossed ? <span>Limit Crossed</span> : null}
      </div>
    </div>
  );
};

export default Timer;
