import React, { FC } from 'react';

import moveDown from '../../../assets/images/arrow-downward.svg';
import moveUp from '../../../assets/images/arrow-upward.svg';
import duplicate from '../../../assets/images/content-copy.svg';
import addNewSection from '../../../assets/images/playlist-add.svg';
import {
  ListContainer,
  ListControlButtons,
  StageItem,
  StagesList,
} from './styles';
import { StageListViewProps } from './types';

const StageListView: FC<StageListViewProps> = ({
  stages,
  activeStage,
  setActiveStage,
}) => (
  <ListContainer>
    <StagesList>
      {stages.map((stage, index) => (
        <StageItem
          key={`${stage.name}-${index}`}
          active={stage === activeStage}
          onClick={() => setActiveStage(stage)}
        >
          <span>{stage.name}</span>
        </StageItem>
      ))}
    </StagesList>
    <ListControlButtons>
      <div>
        <img src={addNewSection}></img>
        <span>New Section</span>
      </div>
      <div>
        <img src={duplicate}></img>
        <span>Duplicate</span>
      </div>
      <div>
        <img src={moveUp}></img>
        <span>Move up</span>
      </div>
      <div>
        <img src={moveDown}></img>
        <span>move down</span>
      </div>
    </ListControlButtons>
  </ListContainer>
);

export default StageListView;
