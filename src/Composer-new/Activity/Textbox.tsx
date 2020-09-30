import React, { FC } from 'react';

import { TextboxWrapper } from './styles';
import { ActivityProps } from './types';

const TextboxActivity: FC<ActivityProps> = ({ activity }) => {
  console.log('textbox activity :: ', activity);

  return <TextboxWrapper>{activity.type}</TextboxWrapper>;
};

export default TextboxActivity;
