import { Task, TaskExecutionState } from '#JobComposer/checklist.types';
import { useTypedSelector } from '#store';
import { formatDuration } from '#utils/timeUtils';
import { Timer as TimerIcon } from '@material-ui/icons';
import moment from 'moment';
import React, { FC, useEffect, useState } from 'react';

const Timer: FC<{
  task: Omit<Task, 'activities'>;
  timerState: { [index: string]: boolean };
  setTimerState: React.Dispatch<
    React.SetStateAction<{ [index: string]: boolean }>
  >;
}> = ({ task, timerState, setTimerState }) => {
  const { recentServerTimestamp } = useTypedSelector((state) => state.extras);
  const { state, startedAt, endedAt } = task.taskExecution;

  const isTaskCompleted =
    state === TaskExecutionState.COMPLETED ||
    state === TaskExecutionState.COMPLETED_WITH_EXCEPTION;
  const isTaskStarted = state === TaskExecutionState.IN_PROGRESS;

  const [timeElapsed, setTimeElapsed] = useState(
    isTaskCompleted && endedAt && startedAt
      ? moment.unix(endedAt).diff(moment.unix(startedAt), 'seconds')
      : isTaskStarted && recentServerTimestamp && startedAt
      ? moment
          .unix(recentServerTimestamp)
          .diff(moment.unix(startedAt), 'seconds')
      : 0,
  );

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined;

    if (state === TaskExecutionState.IN_PROGRESS) {
      interval = setInterval(() => {
        setTimeElapsed((oldTimeElapsed) => {
          const updatedTimeElapsed = ++oldTimeElapsed;
          const updatedTimerState = {
            earlyCompletion: false,
            limitCrossed: false,
          };

          if (task.timerOperator === 'NOT_LESS_THAN') {
            if (task.minPeriod && updatedTimeElapsed < task.minPeriod) {
              updatedTimerState.earlyCompletion = true;
            } else {
              updatedTimerState.earlyCompletion = false;
            }
          }

          if (task.maxPeriod && updatedTimeElapsed > task.maxPeriod) {
            updatedTimerState.limitCrossed = true;
          }

          if (updatedTimerState !== timerState) {
            setTimerState(updatedTimerState);
          }

          return updatedTimeElapsed;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [task]);

  return (
    <div className="task-timer">
      <div className="timer-config">
        <TimerIcon className="icon" />

        <div>
          {task.timerOperator === 'NOT_LESS_THAN' ? (
            <>
              <span>
                Perform task in NLT{' '}
                {task.minPeriod && formatDuration(task.minPeriod)}
              </span>
              <span>
                Max Time limit -{' '}
                {task.maxPeriod && formatDuration(task?.maxPeriod)}
              </span>
            </>
          ) : (
            <span>
              Complete under {task.maxPeriod && formatDuration(task?.maxPeriod)}
            </span>
          )}
        </div>
      </div>

      <div className={`timer ${timerState.limitCrossed ? 'error' : ''}`}>
        <span>{formatDuration(timeElapsed)}</span>
        {timerState.limitCrossed ? <span>Limit Crossed</span> : null}
      </div>
    </div>
  );
};

export default Timer;
