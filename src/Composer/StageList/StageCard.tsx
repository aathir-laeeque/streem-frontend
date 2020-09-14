import { ProgressBar } from '#components';
import { Assignment, CheckCircle, Error, PanTool } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { CompletedTaskStates, StartedTaskStates } from '../checklist.types';
import { setActiveStage } from './actions';
import Wrapper from './styles';
import { StageCardProps } from './types';
import { useTypedSelector } from '#store';

const StageCard: FC<StageCardProps> = ({ stage, isActive }) => {
  const dispatch = useDispatch();

  const { tasksById, tasksOrderInStage } = useTypedSelector(
    (state) => state.composer.tasks,
  );

  const tasks = tasksOrderInStage[stage.id].map((taskId) => tasksById[taskId]);

  const { isAnyTaskStarted, anyTaskHasError, completedTasks } = tasks.reduce(
    ({ isAnyTaskStarted, anyTaskHasError, completedTasks }, task) => {
      const {
        taskExecution: { status },
      } = task;

      isAnyTaskStarted = isAnyTaskStarted || status in StartedTaskStates;

      status in CompletedTaskStates && ++completedTasks;

      // anyTaskHasError ||= !!task.hasError;

      return { isAnyTaskStarted, anyTaskHasError, completedTasks };
    },
    { isAnyTaskStarted: false, anyTaskHasError: false, completedTasks: 0 },
  );

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
      }}
    >
      <div className="stage-header">
        <span className="stage-order">Stage {stage.orderTree}</span>

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
};

export default StageCard;
