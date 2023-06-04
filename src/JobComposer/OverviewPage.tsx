import { useTypedSelector } from '#store';
import { FiberManualRecord } from '@material-ui/icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { setActiveStage } from './StageList/actions';
import { setActiveTask } from './TaskList/actions';
import { CompletedTaskStates, Stage, Task, TaskExecutionState } from './checklist.types';

const Wrapper = styled.div`
  grid-area: 'task-body';
  overflow: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  font-size: 14px;
  flex: 1;
  gap: 24px;
  .toggle-switch {
    margin-left: 0;
  }

  .overview-floating-btn {
    position: absolute;
    right: 5%;
    bottom: 10%;
    .MuiFab-primary {
      background-color: #1d84ff;
    }
  }
`;

const StageDetailCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  .title {
    white-space: nowrap;
  }

  .stage-name {
    font-weight: 700;
    font-size: 14px;
    line-height: 16px;
    letter-spacing: 0.16px;
    color: #000000;
  }
`;

type Props = { backgroundColor?: string };

const TaskDetailCardWrapper = styled.div.attrs({
  className: 'task-detail-card-wrapper',
})<Props>`
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

type CommonProps = {
  setOverviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const TasksOverview: FC<CommonProps> = ({ setOverviewOpen }) => {
  const {
    stages: { stagesOrder, stagesById },
    parameters: { hiddenIds },
  } = useTypedSelector((state) => state.composer);
  return (
    <Wrapper>
      {stagesOrder.map((stageId, index) => {
        if (hiddenIds?.[stageId]) return null;
        const stage = stagesById[stageId];
        return (
          <StageDetailCard
            key={index}
            stageDetails={stage}
            index={index}
            setOverviewOpen={setOverviewOpen}
          />
        );
      })}
    </Wrapper>
  );
};

const StageDetailCard: FC<CommonProps & { stageDetails: Stage; index: number }> = ({
  stageDetails,
  index,
  setOverviewOpen,
}) => {
  const {
    tasks: { tasksOrderInStage, tasksById },
    parameters: { hiddenIds },
  } = useTypedSelector((state) => state.composer);
  return (
    <StageDetailCardWrapper>
      <div>Stage {index + 1}</div>
      <div className="stage-name">{stageDetails?.name}</div>
      {tasksOrderInStage[stageDetails.id].map((taskId, _index) => {
        if (hiddenIds?.[taskId]) return null;
        const task = tasksById[taskId];
        return (
          <TaskDetailCard
            key={_index}
            task={task}
            index={_index}
            stageId={stageDetails?.id}
            setOverviewOpen={setOverviewOpen}
          />
        );
        return null;
      })}
    </StageDetailCardWrapper>
  );
};

const backgroundColor = (taskStatus: TaskExecutionState) => {
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

const TaskDetailCard: FC<CommonProps & { task: Task; stageId: string; index: number }> = ({
  task,
  index,
  stageId,
  setOverviewOpen,
}) => {
  const {
    tasks: { activeTaskId },
  } = useTypedSelector((state) => state.composer);

  const dispatch = useDispatch();

  return (
    <TaskDetailCardWrapper
      onClick={() => {
        console.log("zero overview task'", task);
        dispatch(setActiveStage(stageId, true));
        dispatch(setActiveTask(task?.id, true));
        setOverviewOpen?.(false);
      }}
      backgroundColor={task.id === activeTaskId ? '#e7f1fd' : '#ffffff'}
    >
      <div className="title">Task {index + 1}</div>
      <div className="task-detail-right">
        <FiberManualRecord
          className="icon"
          style={{
            fontSize: '10px',
            color: backgroundColor(task?.taskExecution?.state),
          }}
        />
        <div
          style={
            task?.taskExecution?.state in CompletedTaskStates
              ? {
                  color: '#C2C2C2',
                }
              : { color: '#161616' }
          }
        >
          {task?.name}
        </div>
      </div>
    </TaskDetailCardWrapper>
  );
};

export default TasksOverview;
