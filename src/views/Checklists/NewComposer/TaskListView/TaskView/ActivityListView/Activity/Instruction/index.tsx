import React, { FC } from 'react';

import { ActivityProps } from '../types';
import { Wrapper } from './styles';

const InstructionActivity: FC<ActivityProps> = ({ activity }) => {
  return (
    <Wrapper>
      <div className="activity-header">Write your instruction/notes</div>
    </Wrapper>
  );
};

export default InstructionActivity;
