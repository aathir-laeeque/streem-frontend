import React, { FC } from 'react';

import { MultiSelectWrapper } from './styles';
import { ActivityProps } from './types';

const MultiSelectActivity: FC<ActivityProps> = ({ activity }) => {
  console.log('multi-select activity :: ', activity);

  return <MultiSelectWrapper>{activity.type}</MultiSelectWrapper>;
};

export default MultiSelectActivity;
