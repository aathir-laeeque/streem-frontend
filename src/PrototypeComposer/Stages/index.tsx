import { useTypedSelector } from '#store/helpers';
import React, { createRef, FC } from 'react';

import StageCard from './StageCard';
import { StageListWrapper } from './styles';

const Stages: FC = () => {
  const { activeStageId, listOrder, listById } = useTypedSelector(
    (state) => state.prototypeComposer.stages,
  );

  const refMap = listOrder.map(() => createRef<HTMLDivElement>());

  return (
    <StageListWrapper>
      {listOrder?.map((stageId, index) => (
        <StageCard
          index={index}
          isActive={stageId === activeStageId}
          isFirstItem={index === 0}
          isLastItem={index === (listOrder.length - 1)}
          key={`${stageId}-${index}`}
          ref={refMap[index]}
          stage={listById[stageId]}
        />
      ))}
    </StageListWrapper>
  );
};

export default Stages;
