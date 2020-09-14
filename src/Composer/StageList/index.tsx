import { useTypedSelector } from '#store/helpers';
import React, { FC } from 'react';
import styled from 'styled-components';

import StageCard from './StageCard';

const Wrapper = styled.div.attrs({
  className: 'stage-list-container',
})`
  grid-area: stages;

  display: flex;
  flex-direction: column;
  overflow: auto;
  padding-right: 8px;

  .add-new-item {
    align-items: center;
    background-color: #1d84ff;
    color: #ffffff;
    cursor: pointer;
    display: flex;
    justify-content: center;
    padding: 16px;
  }
`;

const StageListView: FC = () => {
  const { activeStageId, stagesById, stagesOrder } = useTypedSelector(
    (state) => state.composer.stages,
  );

  return (
    <Wrapper>
      {stagesOrder.map((stageId) => (
        <StageCard
          isActive={stageId === activeStageId}
          key={stageId}
          stage={stagesById[stageId]}
        />
      ))}
    </Wrapper>
  );
};

export default StageListView;
