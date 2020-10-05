import SignatureIcon from '#assets/svg/Signature';
import React, { FC } from 'react';

import { SignatureWrapper } from './styles';
import { ActivityProps } from './types';

const SignatureActivity: FC<Omit<ActivityProps, 'taskId'>> = ({}) => {
  return (
    <SignatureWrapper>
      <SignatureIcon className="icon" />
      <span>User will tap here to record his signature</span>
    </SignatureWrapper>
  );
};

export default SignatureActivity;
