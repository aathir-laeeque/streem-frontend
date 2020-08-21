import React, { FC } from 'react';

import { ActivityProps } from '../types';
import { Wrapper } from './styles';

const MultiSelectActivity: FC<ActivityProps> = ({ activity }) => {
  return <Wrapper>MultiSelect Activity {activity.id}</Wrapper>;
};

export default MultiSelectActivity;
