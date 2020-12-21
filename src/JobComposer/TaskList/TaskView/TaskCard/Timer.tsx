import { Task, TaskExecutionState } from '#JobComposer/checklist.types';
import { formatDuration } from '#utils/timeUtils';
import { Timer as TimerIcon } from '@material-ui/icons';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';

const Timer: FC<{ task: Task }> = ({ task }) => {
  const { state, startedAt, endedAt } = task.taskExecution;

  const isTaskCompleted =
    state === TaskExecutionState.COMPLETED ||
    state === TaskExecutionState.COMPLETED_WITH_EXCEPTION;
  const isTaskStarted = state === TaskExecutionState.IN_PROGRESS;

  const [timeElapsed, setTimeElapsed] = useState(
    isTaskCompleted
      ? moment.unix(endedAt).diff(moment.unix(startedAt), 'seconds')
      : isTaskStarted
      ? moment().diff(moment.unix(startedAt), 'seconds')
      : 0,
  );

  const [isLimitCrossed, setLimitCrossed] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined;

    if (state === TaskExecutionState.IN_PROGRESS) {
      interval = setInterval(() => {
        setTimeElapsed(moment().diff(moment.unix(startedAt), 'seconds'));
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [task]);

  useEffect(() => {
    if (timeElapsed > task?.maxPeriod) {
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
              <span>Perform task in NLT {formatDuration(task?.minPeriod)}</span>
              <span>Max Time limit - {formatDuration(task?.maxPeriod)}</span>
            </>
          ) : (
            <span>Complete under {formatDuration(task?.maxPeriod)}</span>
          )}
        </div>
      </div>

      <div className={`timer ${isLimitCrossed ? 'error' : ''}`}>
        <span>{formatDuration(timeElapsed)}</span>
        {isLimitCrossed ? <span>Limit Crossed</span> : null}
      </div>
    </div>
  );
};

export default Timer;
