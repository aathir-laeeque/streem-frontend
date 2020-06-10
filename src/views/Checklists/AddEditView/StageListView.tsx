import React, { FC } from 'react';

import {
  ListContainer,
  ListControlButtons,
  StageItem,
  StagesList,
} from './styles';

import moveDown from '../../../assets/images/arrow-downward.svg';
import moveUp from '../../../assets/images/arrow-upward.svg';
import duplicate from '../../../assets/images/content-copy.svg';
import addNewSection from '../../../assets/images/playlist-add.svg';

import { Stage } from '../types';
import { StageListView } from './types';

const StageListView: FC<StageListView> = ({
  stages,
  activeStage,
  setActiveStage,
}) => (
  <ListContainer>
    <StagesList>
      {(stages as Array<Stage>).map((stage, index) => (
        <StageItem
          key={`${stage.name}-${index}`}
          active={index === activeStage}
          onClick={() => setActiveStage(index)}
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
