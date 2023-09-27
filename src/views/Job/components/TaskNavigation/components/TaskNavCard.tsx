import { CompletedTaskStates, TaskExecutionState } from '#JobComposer/checklist.types';
import { useTypedSelector } from '#store';
import { jobActions } from '#views/Job/jobStore';
import { FiberManualRecord } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const taskStateColor = (taskStatus: TaskExecutionState) => {
  switch (taskStatus) {
    case 'NOT_STARTED':
      return '#F4F4F4';
    case 'IN_PROGRESS':
      return '#24A148';
    case 'BLOCKED':
      return '#FA4D56';
    case 'COMPLETED':
      return '#E0E0E0';
    case 'COMPLETED_WITH_EXCEPTION':
      return '#F1C21B';
    default:
      break;
  }
};

const TaskDetailCardWrapper = styled.div.attrs({
  className: 'task-detail-card-wrapper',
})<{ backgroundColor?: string }>`
  display: flex;
  align-items: center;
  padding: 8px 16px;
  gap: 50px;
  background-color: #ffffff;
  width: 100%;
  cursor: pointer;
  border-bottom: 1px solid #e0e0e0;

  background-color: ${({ backgroundColor }) => `${backgroundColor}`};

  :hover {
    background-color: #e7f1fd;
  }

  .title {
    white-space: nowrap;
  }

  .task-detail-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const TaskNavCard: FC<{ task: any; taskNo: number }> = ({ task, taskNo }) => {
  const dispatch = useDispatch();
  const activeTaskId = useTypedSelector((state) => state.job.taskNavState.current);
  const nameColor = task?.taskExecution?.state in CompletedTaskStates ? '#C2C2C2' : '#161616';

  return (
    <TaskDetailCardWrapper
      onClick={() => {
        // dispatch(setActiveStage(stageId, true));
        // dispatch(setActiveTask(task?.id, true));
        // setOverviewOpen?.(false);
        dispatch(
          jobActions.navigateByTaskId({
            id: task.id,
          }),
        );
      }}
      backgroundColor={task.id === activeTaskId ? '#e7f1fd' : '#ffffff'}
    >
      <div className="title">Task {taskNo}</div>
      <div className="task-detail-right">
        <FiberManualRecord
          className="icon"
          style={{
            fontSize: '0.625rem',
            color: taskStateColor(task?.taskExecution?.state),
          }}
        />
        <div style={{ color: nameColor }}>{task?.name}</div>
      </div>
    </TaskDetailCardWrapper>
  );
};

export default TaskNavCard;