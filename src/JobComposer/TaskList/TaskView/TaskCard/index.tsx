import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import ActivityList from '#JobComposer/ActivityList';
import {
  CompletedTaskStates,
  MandatoryActivity,
  StartedTaskStates,
  TaskExecutionState,
} from '#JobComposer/checklist.types';
import { useTypedSelector } from '#store';
import {
  CompletedJobStates,
  JobStateEnum,
} from '#views/Jobs/NewListView/types';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';
import { setActiveTask } from '../../actions';
import { TaskCardProps } from '../../types';
import Footer from './Footer';
import Header from './Header';
import moment from 'moment';

const Wrapper = styled.div.attrs({
  className: 'task-card',
})<{ isLoading: boolean }>`
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 4px;
  box-shadow: 0 1px 4px 0 rgba(18, 170, 179, 0.08);
  display: flex;
  flex-direction: column;
  grid-area: task-card;
  height: max-content;
  position: relative;

  :hover {
    box-shadow: 0 8px 8px 0 rgba(153, 153, 153, 0.16);
  }

  .loading-wrapper {
    position: absolute;
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 100%;
    display: ${(props) => (props.isLoading ? 'flex' : 'none')};
    background: rgba(236, 236, 236, 0.3);
  }
`;

const TaskCard: FC<TaskCardProps> = ({ task, isActive, enableStopForTask }) => {
  const { recentServerTimestamp } = useTypedSelector((state) => state.extras);
  const {
    jobState,
    activities: { activitiesById, activitiesOrderInTaskInStage },
    stages: { activeStageId },
  } = useTypedSelector((state) => state.composer);

  const {
    state: taskState,
    reason,
    assignees,
    startedAt,
    endedAt,
  } = task.taskExecution;

  const isTaskStarted = taskState in StartedTaskStates;

  const isTaskDelayed = taskState === TaskExecutionState.COMPLETED && reason;

  // as the task is skipped and user should not be able to do anything, treating it same as the completed task.
  const isTaskCompleted =
    taskState === TaskExecutionState.SKIPPED ||
    taskState === TaskExecutionState.COMPLETED ||
    taskState === TaskExecutionState.COMPLETED_WITH_EXCEPTION ||
    taskState === TaskExecutionState.COMPLETED_WITH_CORRECTION;

  const isCompletedWithException =
    taskState === TaskExecutionState.COMPLETED_WITH_EXCEPTION;

  const showStartButton =
    (jobState === JobStateEnum.ASSIGNED ||
      jobState === JobStateEnum.IN_PROGRESS) &&
    !isTaskStarted;

  const showAssignmentButton =
    !(taskState in CompletedTaskStates) &&
    !(jobState in CompletedJobStates) &&
    location.pathname.split('/')[1] !== 'inbox';

  const isCorrectingError =
    taskState === TaskExecutionState.ENABLED_FOR_CORRECTION;

  const [isLoading, setLoadingState] = useState<boolean>(false);

  const [timerState, setTimerState] = useState<{ [index: string]: boolean }>(
    () => {
      const timeElapsed =
        isTaskCompleted && endedAt && startedAt
          ? moment.unix(endedAt).diff(moment.unix(startedAt), 'seconds')
          : isTaskStarted && recentServerTimestamp && startedAt
          ? moment
              .unix(recentServerTimestamp)
              .diff(moment.unix(startedAt), 'seconds')
          : 0;

      return {
        earlyCompletion: !!(
          task.timed &&
          task.minPeriod &&
          timeElapsed &&
          timeElapsed < task.minPeriod
        ),
        limitCrossed: !!(
          task.timed &&
          task.maxPeriod &&
          timeElapsed &&
          timeElapsed > task.maxPeriod
        ),
      };
    },
  );

  const { profile } = useTypedSelector((state) => state.auth);

  const dispatch = useDispatch();

  const isLoggedInUserAssigned = assignees.some(
    (user) => user.id === profile?.id,
  );

  if (activeStageId) {
    const activities = activitiesOrderInTaskInStage[activeStageId][task.id].map(
      (activityId) => activitiesById[activityId],
    );

    const { canSkipTask, activitiesHasError } = activities.reduce(
      ({ canSkipTask, activitiesHasError }, activity) => {
        activitiesHasError ||= activity.hasError;

        if (activity.type in MandatoryActivity) {
          canSkipTask ||= activity.mandatory;
        }

        return { activitiesHasError, canSkipTask: canSkipTask };
      },
      { canSkipTask: false, activitiesHasError: false },
    );

    return (
      <Wrapper
        isLoading={isLoading}
        onClick={() => {
          if (!isActive) {
            dispatch(setActiveTask(task.id));
          }
          if (jobState === JobStateEnum.ASSIGNED && !showAssignmentButton) {
            dispatch(
              openOverlayAction({
                type: OverlayNames.START_JOB_MODAL,
                props: {},
              }),
            );
          }
        }}
      >
        <Header
          task={task}
          showStartButton={showStartButton}
          isTaskStarted={isTaskStarted}
          isTaskDelayed={!!isTaskDelayed}
          enableStopForTask={enableStopForTask}
          showAssignmentButton={showAssignmentButton}
          setLoadingState={setLoadingState}
          timerState={timerState}
          setTimerState={setTimerState}
        />
        <div
          onClick={() => {
            if (
              jobState === JobStateEnum.IN_PROGRESS &&
              !isTaskStarted &&
              isLoggedInUserAssigned
            ) {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.START_TASK_ERROR_MODAL,
                }),
              );
            }
          }}
        >
          <ActivityList
            activities={activities}
            isTaskStarted={isTaskStarted}
            isTaskCompleted={isTaskCompleted}
            isCompletedWithException={isCompletedWithException}
            isCorrectingError={isCorrectingError}
            isLoggedInUserAssigned={isLoggedInUserAssigned}
          />
        </div>

        <Footer
          canSkipTask={!canSkipTask}
          task={task}
          activitiesHasError={activitiesHasError}
          timerState={timerState}
          setLoadingState={setLoadingState}
        />
        <div className="loading-wrapper">
          <CircularProgress style={{ color: '#1d84ff' }} />
        </div>
      </Wrapper>
    );
  } else {
    return null;
  }
};

export default TaskCard;
