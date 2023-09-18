import MediaCard from '#JobComposer/TaskList/TaskView/MediaCard';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { TaskPauseReasons } from '#types';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { useJobStateToFlags } from '#views/Job/utils';
import { JobStateEnum } from '#views/Jobs/ListView/types';
import { TextareaAutosize } from '@material-ui/core';
import moment from 'moment';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import AutomationInfo from './AutomationInfo';
import Footer from './Footer';
import Header from './Header';
import ParameterList from './Parameters';

const TaskWrapper = styled.div`
  flex: 6.5;
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  box-shadow: 0 1px 4px 0 rgba(18, 170, 179, 0.08);
  grid-area: task-card;
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-rows: auto auto 1fr auto auto;
  grid-template-areas:
    'task-header'
    'task-media-card'
    'task-body'
    'task-automation'
    'task-footer';

  :hover {
    box-shadow: 0 8px 8px 0 rgba(153, 153, 153, 0.16);
  }

  .task-body {
    grid-area: task-body;
    overflow: auto;
    background: #f4f4f4;
  }

  .task-pause-details {
    display: flex;
    flex-direction: column;
    padding: 14px 16px;
    background-color: #ffffff;
    gap: 8px;
    > div:first-child {
      background-color: #ffedd7;
      color: #ff541e;
      padding: 4px 8px;
      width: fit-content;
    }

    &-reason {
      background-color: #ffffff;
      padding: 4px 0px 4px 8px;
      font-weight: 400;
      font-size: 14px;
      color: #161616;
    }
  }

  .task-audit {
    color: #525252;
    font-size: 12px;
    line-height: 16px;
    padding: 14px 16px;
    background-color: white;
  }
`;

const Task: FC = () => {
  const dispatch = useDispatch();
  const {
    taskNavState,
    tasks,
    assignments: { isUserAssigned },
    state: jobState,
    isInboxView,
  } = useTypedSelector((state) => state.job);

  const { recentServerTimestamp } = useTypedSelector((state) => state.extras);

  const { isTaskStarted, isTaskCompleted, isTaskPaused } = useJobStateToFlags();

  if (!jobState || !taskNavState.current) return null;

  const task = tasks.get(taskNavState.current);

  if (!task) return null;

  const {
    parameters: parameterIds,
    isUserAssignedToTask,
    parametersErrors,
    taskExecution: { state: taskState, startedAt, endedAt, correctionEnabled, pauseReasons, audit },
  } = task!;

  const [timerState, setTimerState] = useState<{ [index: string]: boolean }>(() => {
    const timeElapsed =
      isTaskCompleted && endedAt && startedAt
        ? moment.unix(endedAt).diff(moment.unix(startedAt), 'seconds')
        : isTaskStarted && recentServerTimestamp && startedAt
        ? moment.unix(recentServerTimestamp).diff(moment.unix(startedAt), 'seconds')
        : 0;

    return {
      earlyCompletion: !!(
        task.timed &&
        task.minPeriod &&
        timeElapsed &&
        timeElapsed < task.minPeriod
      ),
      limitCrossed: !!(task.timed && task.maxPeriod && timeElapsed && timeElapsed > task.maxPeriod),
    };
  });

  const handleTaskBodyClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    // e.preventDefault();         // Commenting for the working of date, date-time and file upload parameters

    if (jobState === JobStateEnum.ASSIGNED && !isTaskCompleted && !isInboxView) {
      dispatch(
        openOverlayAction({
          type: OverlayNames.START_JOB_MODAL,
        }),
      );
    }
    if (jobState === JobStateEnum.IN_PROGRESS && !isTaskStarted && isUserAssigned) {
      dispatch(
        openOverlayAction({
          type: OverlayNames.START_TASK_ERROR_MODAL,
          props: {
            taskState,
          },
        }),
      );
    }
  };

  return (
    <TaskWrapper data-testid="task-wrapper" key={taskNavState.current}>
      <Header task={task} timerState={timerState} setTimerState={setTimerState} />
      <MediaCard medias={task.medias} isTaskActive={true} />
      <div className="task-body" onClick={handleTaskBodyClick}>
        {isTaskPaused && (
          <div className="task-pause-details">
            <div>Task Paused</div>
            <TextareaAutosize
              className="task-pause-details-reason"
              value={
                pauseReasons?.[0]?.comment ??
                TaskPauseReasons?.[
                  pauseReasons?.[0]?.taskPauseReason as keyof typeof TaskPauseReasons
                ] ??
                ''
              }
              minRows={2}
              maxRows={4}
              disabled
            />
            {/* <div>
                    Task Paused by {getFullName(audit.modifiedBy)}, ID:{' '}
                    {audit.modifiedBy.employeeId} on {formatDateTime(audit.modifiedAt)}
                  </div> */}
          </div>
        )}
        {!isTaskStarted && (
          <div
            className="task-audit"
            style={{ paddingTop: isTaskPaused || !!correctionEnabled ? '0px' : '14px' }}
          >
            {audit
              ? audit.modifiedBy && (
                  <>
                    Last updated by {getFullName(audit.modifiedBy)}, ID:{' '}
                    {audit.modifiedBy.employeeId} on {formatDateTime(audit.modifiedAt)}
                  </>
                )
              : 'Updating...'}
          </div>
        )}
        <ParameterList
          parameterIds={parameterIds}
          isTaskStarted={isTaskStarted}
          isTaskCompleted={isTaskCompleted}
          isCorrectingError={!!correctionEnabled}
          isUserAssignedToTask={isUserAssignedToTask}
          parametersErrors={parametersErrors}
        />
      </div>
      <AutomationInfo task={task} />
      <Footer task={task} timerState={timerState} />
    </TaskWrapper>
  );
};

export default Task;
