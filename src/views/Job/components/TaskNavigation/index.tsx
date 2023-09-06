import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import styled from 'styled-components';
import StageNavCard from './components/StageNavCard';

const TaskNavigationWrapper = styled.div`
  flex: 3.5;
  display: flex;
  background-color: #fff;
  overflow: auto;
  padding: 1.5rem;
  font-size: 0.875rem;
  flex-direction: column;
  gap: 1.5rem;
`;

const TaskNavigation: FC = () => {
  const stages = useTypedSelector((state) => state.job.stages);

  const renderStages = () => {
    const _stages: JSX.Element[] = [];
    let stageNo = 1;
    stages.forEach((stage) => {
      stage.visibleTasksCount && _stages.push(<StageNavCard stage={stage} stageNo={stageNo} />);
      stageNo++;
    });
    return _stages;
  };

  return <TaskNavigationWrapper data-testid="task-nav">{renderStages()}</TaskNavigationWrapper>;
};

export default TaskNavigation;
