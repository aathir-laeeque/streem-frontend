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
  const {
    stages: { activeStageId, listById },
  } = useTypedSelector((state) => state.composer);

  return (
    <Wrapper>
      {Object.values(listById).map((stage) => (
        <StageCard
          isActive={stage.id === activeStageId}
          key={stage.id}
          stage={stage}
        />
      ))}
    </Wrapper>
  );
};

export default StageListView;
