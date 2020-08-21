import React, { FC } from 'react';

import { ActivityProps } from '../types';
import { Wrapper } from './styles';

const MediaActivity: FC<ActivityProps> = ({ activity }) => {
  return <Wrapper>Media Activity {activity.id}</Wrapper>;
};

export default MediaActivity;
