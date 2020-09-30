import React, { FC } from 'react';

import { InstructionWrapper } from './styles';
import { ActivityProps } from './types';

const InstructionActivity: FC<ActivityProps> = ({ activity }) => {
  return <InstructionWrapper>{activity.type}</InstructionWrapper>;
};

export default InstructionActivity;
