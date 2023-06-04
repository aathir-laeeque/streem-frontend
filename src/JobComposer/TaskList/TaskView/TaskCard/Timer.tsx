import { Task, TaskExecutionState } from '#JobComposer/checklist.types';
import { useTypedSelector } from '#store';
import { formatDuration } from '#utils/timeUtils';
import { Timer as TimerIcon } from '@material-ui/icons';
import moment from 'moment';
import React, { FC, useEffect, useRef, useState } from 'react';

const Timer: FC<{
  task: Omit<Task, 'parameters'>;
  timerState: { [index: string]: boolean };
  setTimerState: React.Dispatch<React.SetStateAction<{ [index: string]: boolean }>>;
}> = ({ task, timerState, setTimerState }) => {
  const { recentServerTimestamp } = useTypedSelector((state) => state.extras);
  const { state, startedAt, endedAt } = task.taskExecution;
  const componentDidMount = useRef(false);

  const isTaskCompleted =
    state === TaskExecutionState.COMPLETED || state === TaskExecutionState.COMPLETED_WITH_EXCEPTION;

  const isTaskStarted =
    state === TaskExecutionState.IN_PROGRESS || state === TaskExecutionState.PAUSED;

  const calcTimeElapsed = () => {
    if (isTaskCompleted && endedAt && startedAt) {
      return moment.unix(endedAt).diff(moment.unix(startedAt), 'seconds');
    } else if (isTaskStarted && task?.taskExecution?.duration && startedAt) {
      return task?.taskExecution?.duration;
    } else if (isTaskStarted && recentServerTimestamp && startedAt) {
      return moment.unix(recentServerTimestamp).diff(moment.unix(startedAt), 'seconds');
    } else {
      return 0;
    }
  };

  const updateTimerState = (updatedTimeElapsed: number) => {
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
  };

  const [timeElapsed, setTimeElapsed] = useState(calcTimeElapsed());

  useEffect(() => {
    if (componentDidMount.current && !task?.taskExecution?.duration) {
      const updatedTimeElapsed: number = calcTimeElapsed();
      updateTimerState(updatedTimeElapsed);
      setTimeElapsed(updatedTimeElapsed);
    } else {
      componentDidMount.current = true;
    }
  }, [recentServerTimestamp]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined = undefined;

    if (state === TaskExecutionState.IN_PROGRESS) {
      interval = setInterval(() => {
        setTimeElapsed((oldTimeElapsed) => {
          const updatedTimeElapsed = ++oldTimeElapsed;
          updateTimerState(updatedTimeElapsed);
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
      </div>

      <div className={`timer ${timerState.limitCrossed ? 'error' : ''}`}>
        <span>{formatDuration(timeElapsed)}</span>
      </div>
    </div>
  );
};

export default Timer;
