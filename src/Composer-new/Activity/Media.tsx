import React, { FC } from 'react';

import { MediaWrapper } from './styles';
import { ActivityProps } from './types';

const MediaActivity: FC<ActivityProps> = ({ activity }) => {
  console.log('media activity :: ', activity);

  return <MediaWrapper>{activity.type}</MediaWrapper>;
};

export default MediaActivity;
