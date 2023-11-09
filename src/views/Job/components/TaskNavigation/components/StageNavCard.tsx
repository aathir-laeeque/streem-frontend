import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import styled from 'styled-components';
import TaskNavCard from './TaskNavCard';

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

const StageNavCard: FC<{ stage: any; stageNo: number }> = ({ stage, stageNo }) => {
  const tasks = useTypedSelector((state) => state.job.tasks);

  const renderTasks = (taskIds: string[]) => {
    const _tasks: JSX.Element[] = [];
    let taskNo = 1;
    taskIds.forEach((taskId) => {
      const task = tasks.get(taskId);
      task!.visibleParametersCount &&
        _tasks.push(
          <TaskNavCard task={task} taskNo={taskNo} key={task!.id} errors={task!.errors} />,
        );
      taskNo++;
    });
    return _tasks;
  };

  return (
    <StageDetailCardWrapper key={stage.id}>
      <div>Stage {stageNo}</div>
      <div className="stage-name">{stage.name}</div>
      {renderTasks(stage.tasks)}
    </StageDetailCardWrapper>
  );
};

export default StageNavCard;
