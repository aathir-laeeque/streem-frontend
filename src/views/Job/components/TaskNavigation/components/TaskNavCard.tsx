import { useTypedSelector } from '#store';
import { COMPLETED_TASK_STATES, TaskExecutionStates } from '#types';
import { jobActions } from '#views/Job/jobStore';
import { FiberManualRecord } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

const taskStateColor = (taskStatus: TaskExecutionStates) => {
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
})<{ backgroundColor?: string; error: boolean }>`
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
    color: ${({ error }) => `${error ? '#DA1E28' : 'unset'}`};
  }

  .task-detail-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const TaskNavCard: FC<{ task: any; taskNo: number; errors: string[] }> = ({
  task,
  taskNo,
  errors,
}) => {
  const dispatch = useDispatch();
  const activeTaskId = useTypedSelector((state) => state.job.taskNavState.current);
  const isError = !!errors.length;
  const nameColor = task?.taskExecution?.state in COMPLETED_TASK_STATES ? '#C2C2C2' : '#161616';
  const backgroundColor =
    task.id === activeTaskId ? (isError ? '#FFF1F1' : '#e7f1fd') : isError ? '#FFF1F1' : '#ffffff';

  return (
    <TaskDetailCardWrapper
      onClick={() => {
        dispatch(
          jobActions.navigateByTaskId({
            id: task.id,
          }),
        );
      }}
      backgroundColor={backgroundColor}
      error={isError && task.id === activeTaskId}
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
