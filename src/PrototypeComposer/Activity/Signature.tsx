import SignatureIcon from '#assets/svg/Signature';
import React, { FC } from 'react';
import ActivityLabelInput from './ActivityLabelInput';
import { SignatureWrapper } from './styles';
import { ActivityProps } from './types';

const SignatureActivity: FC<Omit<ActivityProps, 'taskId'>> = ({ activity }) => {
  return (
    <>
      <ActivityLabelInput activity={activity} />
      <SignatureWrapper>
        <SignatureIcon className="icon" />
        <span>User will tap here to record his signature</span>
      </SignatureWrapper>
    </>
  );
};

export default SignatureActivity;
