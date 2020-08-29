import { useTypedSelector } from '#store/helpers';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { addNewStage } from './actions';
import StageCard from './StageCard';
import { Stage } from '../checklist.types';

const Wrapper = styled.div.attrs({
  className: 'stage-list-container',
})`
  grid-area: stages;

  display: flex;
  flex-direction: column;
  overflow: auto;

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

const generateNewStage = (): Omit<Stage, 'tasks'> => ({
  id: 9999,
  name: '',
  code: '',
  orderTree: 9999,
});

const StageListView: FC = () => {
  const { list, activeStageId } = useTypedSelector(
    (state) => state.composer.stages,
  );

  const dispatch = useDispatch();

  return (
    <Wrapper>
      {list.map((stage) => (
        <StageCard
          isActive={stage.id === activeStageId}
          key={stage.id}
          stage={stage}
        />
      ))}

      <div
        className="add-new-item"
        onClick={() => dispatch(addNewStage(generateNewStage()))}
      >
        Add new Stage
      </div>
    </Wrapper>
  );
};

export default StageListView;
