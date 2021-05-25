import { ProgressBar } from '#components';
import { Assignment, CheckCircle, Error, PanTool } from '@material-ui/icons';
import React, { forwardRef } from 'react';
import { useDispatch } from 'react-redux';

import { CompletedTaskStates, StartedTaskStates } from '../checklist.types';
import {
  setActiveStage,
  startPollActiveStageData,
  stopPollActiveStageData,
} from './actions';
import Wrapper from './styles';
import { StageCardProps } from './types';
import { useTypedSelector } from '#store';

type Ref = HTMLDivElement;

const StageCard = forwardRef<Ref, StageCardProps>(
  ({ stage, isActive, index }, ref) => {
    const dispatch = useDispatch();

    const {
      tasks: { tasksById, tasksOrderInStage },
      jobId,
      stageReports,
    } = useTypedSelector((state) => ({
      tasks: state.composer.tasks,
      jobId: state.composer.entityId,
      stageReports: state.composer.stages?.stageReports,
    }));

    const tasks = tasksOrderInStage[stage.id].map(
      (taskId) => tasksById[taskId],
    );

    const tasksStatus = tasks.reduce(
      ({ isAnyTaskStarted, anyTaskHasError, completedTasks }, task) => {
        const {
          taskExecution: { state },
        } = task;

        isAnyTaskStarted = isAnyTaskStarted || state in StartedTaskStates;

        if (state in CompletedTaskStates) {
          ++completedTasks;
        }

        anyTaskHasError ||= task.hasError;

        return { isAnyTaskStarted, anyTaskHasError, completedTasks };
      },
      { isAnyTaskStarted: false, anyTaskHasError: false, completedTasks: 0 },
    );

    let { isAnyTaskStarted, completedTasks } = tasksStatus;
    const { anyTaskHasError } = tasksStatus;
    const stageReport = stageReports?.[stage.id];

    if (stageReport) {
      completedTasks =
        stageReport.completedTasks > completedTasks
          ? stageReport.completedTasks
          : completedTasks;
      isAnyTaskStarted =
        stageReport?.tasksInProgress === true
          ? stageReport?.tasksInProgress
          : isAnyTaskStarted;
    }

    const precentageOfCompleteTasks = Math.round(
      (completedTasks / tasks.length) * 100,
    );

    const allTasksCompleted = completedTasks === tasks.length;

    return (
      <Wrapper
        isActive={isActive}
        isAnyTaskStarted={isAnyTaskStarted}
        allTasksCompleted={allTasksCompleted}
        anyTaskHasError={anyTaskHasError}
        onClick={() => {
          if (!isActive) {
            dispatch(setActiveStage(stage.id));
          }
          if (jobId) {
            dispatch(stopPollActiveStageData());
            dispatch(startPollActiveStageData({ jobId }));
          }
        }}
        ref={ref}
      >
        <div className="stage-header">
          <span className="stage-order">Stage {index + 1}</span>

          <PanTool className="icon stop-icon" />

          <div className="stage-badge">
            {(() => {
              if (anyTaskHasError) {
                return (
                  <>
                    <Error className="icon" />
                    <span>Task Incomplete</span>
                  </>
                );
              } else if (allTasksCompleted) {
                return (
                  <>
                    <CheckCircle className="icon" />
                    <span>Completed</span>
                  </>
                );
              } else if (isAnyTaskStarted) {
                return (
                  <>
                    <Assignment className="icon" />
                    <span>In Progress</span>
                  </>
                );
              } else {
                return (
                  <>
                    <Assignment className="icon" />
                    <span>Not Started</span>
                  </>
                );
              }
            })()}
          </div>
        </div>

        <div className="stage-name">{stage.name}</div>

        <div className="stage-task-bar">
          <span>{precentageOfCompleteTasks}% Task completed</span>
          <ProgressBar percentage={precentageOfCompleteTasks} />
        </div>
      </Wrapper>
    );
  },
);

export default StageCard;
