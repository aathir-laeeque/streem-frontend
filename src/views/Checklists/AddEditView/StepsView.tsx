import React, { FC } from 'react';

import { StepsViewProps } from './types';
import { Steps } from './styles';

const StepsView: FC<StepsViewProps> = ({ stageNumber }) => (
  <Steps>Stage {stageNumber}</Steps>
);

export default StepsView;
