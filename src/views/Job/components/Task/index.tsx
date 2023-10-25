import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store';
import { StoreTask, TaskPauseReasons } from '#types';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { jobActions } from '#views/Job/jobStore';
import { useJobStateToFlags } from '#views/Job/utils';
import { JobStateEnum } from '#views/Jobs/ListView/types';
import { TextareaAutosize } from '@material-ui/core';
import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import AutomationInfo from './AutomationInfo';
import Footer from './Footer';
import Header from './Header';
import ParameterList from './Parameters';
import { useLocation } from '@reach/router';
import MediaCard from './MediaCard/MediaCard';

const TaskWrapper = styled.div.attrs({
  id: 'task-wrapper',
})<{ $isMobileDrawerOpen: boolean }>`
  width: ${({ $isMobileDrawerOpen }) => ($isMobileDrawerOpen ? '0%' : '100%')};
  @media (min-width: 900px) {
    width: 65%;
  }
  transition: all 0.3s;
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
    background: hsl(0, 0%, 96%);
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

const Task: FC<{ task: StoreTask }> = ({ task }) => {
  const dispatch = useDispatch();
  const {
    taskNavState,
    assignments: { isUserAssigned },
    state: jobState,
    isInboxView,
    id,
    state,
  } = useTypedSelector((state) => state.job);
  const location = useLocation();
  const { verificationTaskId } = location.state;
  const [opacity, setOpacity] = useState(0);
  const { isTaskStarted, isTaskCompleted, isTaskPaused } = useJobStateToFlags();

  useEffect(() => {
    dispatch(jobActions.stopPollActiveStageData());
    dispatch(
      jobActions.startPollActiveStageData({ jobId: id!, stageId: task.stageId!, state: state! }),
    );
    setOpacity(1);
    if (verificationTaskId) {
      dispatch(
        jobActions.navigateByTaskId({
          id: verificationTaskId,
        }),
      );
    }
    return () => {
      dispatch(jobActions.stopPollActiveStageData());
    };
  }, []);

  const {
    parameters: parameterIds,
    isUserAssignedToTask,
    parametersErrors,
    taskExecution: { state: taskState, correctionEnabled, pauseReasons, audit },
  } = task!;

  const handleTaskBodyClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    // Commenting for the working of date, date-time and file upload parameters
    // e.preventDefault();

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
    <TaskWrapper
      $isMobileDrawerOpen={taskNavState.isMobileDrawerOpen}
      data-testid="task-wrapper"
      key={taskNavState.current}
      style={{ opacity }}
    >
      <Header task={task} />
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
                    {audit.modifiedBy.employeeId} on {formatDateTime({ value: audit.modifiedAt })}
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
      <Footer task={task} />
    </TaskWrapper>
  );
};

const TaskContainer: FC = () => {
  const { taskNavState, tasks, state: jobState } = useTypedSelector((state) => state.job);

  if (!jobState || !taskNavState.current) return null;

  const task = tasks.get(taskNavState.current)!;
  return <Task task={task} key={task.id} />;
};

export default TaskContainer;
