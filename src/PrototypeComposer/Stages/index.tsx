import { Button } from '#components';
import { useTypedSelector } from '#store/helpers';
import { AddCircleOutline } from '@material-ui/icons';
import React, { createRef, FC } from 'react';
import { useDispatch } from 'react-redux';
import { addNewStage } from './actions';
import StageCard from './StageCard';
import { StageListWrapper } from './styles';

const Stages: FC<{ allowNewAddition: boolean }> = ({ allowNewAddition }) => {
  const dispatch = useDispatch();
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
          isLastItem={index === listOrder.length - 1}
          key={`${stageId}-${index}`}
          ref={refMap[index]}
          stage={listById[stageId]}
        />
      ))}
      {allowNewAddition && (
        <Button variant="secondary" className="add-item" onClick={() => dispatch(addNewStage())}>
          <AddCircleOutline className="icon" fontSize="small" />
          Add New Stage
        </Button>
      )}
    </StageListWrapper>
  );
};

export default Stages;
