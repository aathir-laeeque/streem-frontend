import React, { FC } from 'react';

import { StepsViewProps } from './types';
import { Steps, StageNumber, StageName } from './styles';
import StepsListView from './StepsListView';

const StepsView: FC<StepsViewProps> = ({ stageNumber, stage }) => (
  <Steps>
    <StageNumber>Stage {stageNumber}</StageNumber>
    <StageName>{stage?.name}</StageName>
    <StepsListView steps={stage?.steps || []} />
  </Steps>
);

export default StepsView;
