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
  padding: 0px 8px 0px 16px;

  @media (max-width: 900px) {
    display: none;
  }

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
    stages: { activeStageId, stagesById, stagesOrder, bringIntoView },
    parameters: { hiddenIds },
  } = useTypedSelector((state) => state.composer);

  const refMap = stagesOrder.reduce<Record<Stage['id'], RefObject<HTMLDivElement>>>(
    (acc, stageId) => {
      acc[stageId] = createRef<HTMLDivElement>();

      return acc;
    },
    {},
  );

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
      {stagesOrder.map((stageId) => {
        if (hiddenIds?.[stageId]) return null;
        return (
          <StageCard
            isActive={stageId === activeStageId}
            key={stageId}
            stage={stagesById[stageId]}
            ref={refMap[stageId]}
          />
        );
      })}
    </Wrapper>
  );
};

export default StageListView;
