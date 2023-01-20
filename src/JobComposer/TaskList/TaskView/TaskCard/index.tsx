import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import ParameterList from '#JobComposer/ActivityList';
import {
  CompletedTaskStates,
  MandatoryParameter,
  StartedTaskStates,
  TaskExecutionState,
} from '#JobComposer/checklist.types';
import { useTypedSelector } from '#store';
import { CompletedJobStates, JobStateEnum } from '#views/Jobs/ListView/types';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setActiveTask } from '../../actions';
import { TaskCardProps } from '../../types';
import Footer from './Footer';
import Header from './Header';
import AutomationInfo from './AutomationInfo';
import { CircularProgress } from '@material-ui/core';
import moment from 'moment';
import MediaCard from '../MediaCard';

const Wrapper = styled.div.attrs({
  className: 'task-card',
})<{ isLoading: boolean }>`
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  box-shadow: 0 1px 4px 0 rgba(18, 170, 179, 0.08);
  display: flex;
  flex-direction: column;
  grid-area: task-card;
  height: max-content;
  position: relative;
  overflow-x: hidden;

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
  } = task.taskExecution;

  const dispatch = useDispatch();

  const isLoggedInUserAssigned = assignees.some((user) => user.id === profile?.id);

  if (activeStageId) {
    const parameters = parametersOrderInTaskInStage[activeStageId][task.id].map(
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

    const showStartButton =
      (jobState === JobStateEnum.ASSIGNED || jobState === JobStateEnum.IN_PROGRESS) &&
      !isTaskStarted;

    const showAssignmentButton =
      !(taskState in CompletedTaskStates) &&
      !(jobState in CompletedJobStates) &&
      location.pathname.split('/')[1] !== 'inbox';

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
        <MediaCard medias={task.medias} isTaskActive={isActive} />
        <div
          onClick={() => {
            if (jobState === JobStateEnum.IN_PROGRESS && !isTaskStarted && isLoggedInUserAssigned) {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.START_TASK_ERROR_MODAL,
                }),
              );
            }
          }}
        >
          <ParameterList
            parameters={parameters}
            isTaskStarted={isTaskStarted}
            isTaskCompleted={isTaskCompleted}
            isCorrectingError={!!correctionEnabled}
            isLoggedInUserAssigned={isLoggedInUserAssigned}
          />
        </div>

        <AutomationInfo task={task} />

        <Footer
          canSkipTask={!canSkipTask}
          task={task}
          parametersHasError={parametersHasError}
          setLoadingState={setLoadingState}
          timerState={timerState}
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
