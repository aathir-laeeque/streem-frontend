import React, { FC } from 'react';

import { SignatureWrapper } from './styles';
import { ActivityProps } from './types';

const SignatureActivity: FC<ActivityProps> = ({ activity }) => {
  console.log('signature activity :: ', activity);

  return <SignatureWrapper>{activity.type}</SignatureWrapper>;
};

export default SignatureActivity;
