import { useTypedSelector } from '#store/helpers';
import React, { createRef, FC, RefObject, useEffect } from 'react';
import styled from 'styled-components';

import StageCard from './StageCard';
import { Stage } from '../checklist.types';

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
    activeStageId,
    stagesById,
    stagesOrder,
    bringIntoView,
  } = useTypedSelector((state) => state.composer.stages);

  const refMap = stagesOrder.reduce<
    Record<Stage['id'], RefObject<HTMLDivElement>>
  >((acc, stageId) => {
    acc[stageId] = createRef<HTMLDivElement>();

    return acc;
  }, {});

  useEffect(() => {
    if (activeStageId && bringIntoView) {
      if (refMap[activeStageId].current) {
        refMap[activeStageId].current.scrollIntoView({
          behaviour: 'smooth',
          block: 'start',
        });
      }
    }
  }, [activeStageId]);

  return (
    <Wrapper>
      {stagesOrder.map((stageId, index) => (
        <StageCard
          isActive={stageId === activeStageId}
          key={stageId}
          stage={stagesById[stageId]}
          ref={refMap[stageId]}
        />
      ))}
    </Wrapper>
  );
};

export default StageListView;
