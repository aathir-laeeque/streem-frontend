import React, { FC } from 'react';

import { ActivityProps } from '../types';
import { Wrapper } from './styles';

const InstructionActivity: FC<ActivityProps> = ({ activity }) => {
  return <Wrapper>Instruction Activity {activity.id}</Wrapper>;
};

export default InstructionActivity;
