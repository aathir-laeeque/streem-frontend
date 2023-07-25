import ParameterList from '#JobComposer/ActivityList';
import TasksOverview from '#JobComposer/OverviewPage';
import {
  CompletedTaskStates,
  MandatoryParameter,
  StartedTaskStates,
  TaskExecutionState,
} from '#JobComposer/checklist.types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { CompletedJobStates, JobStateEnum } from '#views/Jobs/ListView/types';
import { CircularProgress, TextareaAutosize } from '@material-ui/core';
import moment from 'moment';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setActiveTask } from '../../actions';
import { TaskCardProps, TaskPauseReasons } from '../../types';
import MediaCard from '../MediaCard';
import AutomationInfo from './AutomationInfo';
import Footer from './Footer';
import Header from './Header';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';

const Wrapper = styled.div.attrs({
  className: 'task-card',
})<{ isLoading: boolean }>`
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

const TaskCard: FC<TaskCardProps> = ({ task, isActive, enableStopForTask, overviewOpen }) => {
  const [isLoading, setLoadingState] = useState<boolean>(false);
  const {
    jobState,
    parameters: { parametersById, parametersOrderInTaskInStage },
    stages: { activeStageId },
  } = useTypedSelector((state) => state.composer);
  const { recentServerTimestamp } = useTypedSelector((state) => state.extras);
  const { profile } = useTypedSelector((state) => state.auth);

  const {
    state: taskState,
    reason,
    assignees,
    startedAt,
    endedAt,
    correctionEnabled,
    pauseReasons,
  } = task.taskExecution;

  const dispatch = useDispatch();

  const isLoggedInUserAssigned = (assignees || []).some((user) => user.id === profile?.id);

  if (activeStageId) {
    const parameters = parametersOrderInTaskInStage[activeStageId]?.[task.id].map(
      (parameterId) => parametersById[parameterId],
    );

    const { canSkipTask, parametersHasError } = parameters.reduce(
      ({ canSkipTask, parametersHasError }, parameter) => {
        parametersHasError ||= parameter.hasError;

        if (parameter.type in MandatoryParameter) {
          canSkipTask ||= parameter.mandatory;
        }

        return { parametersHasError, canSkipTask: canSkipTask };
      },
      { canSkipTask: false, parametersHasError: false },
    );

    const isTaskStarted = taskState in StartedTaskStates;
    const isTaskDelayed = taskState === TaskExecutionState.COMPLETED && reason;
    const isTaskCompleted =
      taskState === TaskExecutionState.SKIPPED ||
      taskState === TaskExecutionState.COMPLETED ||
      taskState === TaskExecutionState.COMPLETED_WITH_EXCEPTION;
    const isTaskPaused = taskState === TaskExecutionState.PAUSED;

    const showStartButton =
      (jobState === JobStateEnum.ASSIGNED || jobState === JobStateEnum.IN_PROGRESS) &&
      !isTaskStarted;

    const showAssignmentButton =
      !(taskState in CompletedTaskStates) &&
      !(jobState in CompletedJobStates) &&
      location.pathname.split('/')[1] !== 'inbox';

    const isJobInInbox = location.pathname.split('/')[1] === 'inbox';

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
        limitCrossed: !!(
          task.timed &&
          task.maxPeriod &&
          timeElapsed &&
          timeElapsed > task.maxPeriod
        ),
      };
    });

    return (
      <Wrapper
        isLoading={isLoading}
        onClick={() => {
          if (!isActive) {
            dispatch(setActiveTask(task.id));
          }
        }}
      >
        {overviewOpen?.[0] ? (
          <TasksOverview setOverviewOpen={overviewOpen[1]} />
        ) : (
          <>
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
              canSkipTask={!canSkipTask}
            />
            <MediaCard medias={task.medias} isTaskActive={isActive} />
            <div
              style={{
                gridArea: 'task-body',
                overflow: 'auto',
                background: '#F4F4F4',
              }}
              onClick={() => {
                if (jobState === JobStateEnum.ASSIGNED && !showAssignmentButton) {
                  dispatch(
                    openOverlayAction({
                      type: OverlayNames.START_JOB_MODAL,
                      props: {},
                    }),
                  );
                }
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
              {isTaskPaused && (
                <div className="task-pause-details">
                  <div>Task Paused</div>
                  <TextareaAutosize
                    className="task-pause-details-reason"
                    value={
                      pauseReasons?.[0]?.comment ??
                      TaskPauseReasons?.[pauseReasons?.[0]?.taskPauseReason] ??
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
              <ParameterList
                parameters={parameters}
                isTaskStarted={isTaskStarted}
                isTaskCompleted={isTaskCompleted}
                isCorrectingError={!!correctionEnabled}
                isLoggedInUserAssigned={isLoggedInUserAssigned}
                isJobInInbox={isJobInInbox}
              />
            </div>
            <AutomationInfo task={task} />
          </>
        )}

        <Footer
          canSkipTask={!canSkipTask}
          task={task}
          parametersHasError={parametersHasError}
          setLoadingState={setLoadingState}
          timerState={timerState}
          enableStopForTask={enableStopForTask}
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
