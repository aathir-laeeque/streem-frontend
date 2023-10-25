import selfVerifiedIcon from '#assets/svg/self-verified-icon.svg';
import { Button } from '#components';
import { useTypedSelector } from '#store';
import { ParameterState, ParameterVerificationStatus } from '#types';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { jobActions } from '#views/Job/jobStore';
import React, { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import SelfVerificationAction from './SelfVerificationAction';

const SelfVerification: FC<{
  parameterId: string;
  verification: any;
  isLoggedInUserAssigned?: boolean;
  parameterState: string;
  modifiedBy: string;
}> = ({ parameterId, verification, isLoggedInUserAssigned, parameterState, modifiedBy }) => {
  const dispatch = useDispatch();
  const {
    auth: { userId },
  } = useTypedSelector((state) => state);

  const SelfVerifyButton = () => {
    if (modifiedBy === userId)
      return (
        <div className="parameter-verification">
          <Button
            onClick={() => {
              dispatch(jobActions.initiateSelfVerification({ parameterId }));
            }}
          >
            Self Verify
          </Button>
        </div>
      );
    return null;
  };

  if (parameterState === ParameterState.BEING_EXECUTED && isLoggedInUserAssigned) {
    return <SelfVerifyButton />;
  }

  switch (verification?.verificationStatus) {
    case ParameterVerificationStatus.ACCEPTED:
      return (
        <div className="parameter-audit">
          <div className="parameter-verified">
            <img src={selfVerifiedIcon} alt="Self Verified" />
            <div>
              Self Verified by {getFullName(verification.modifiedBy)}, ID:{' '}
              {verification.modifiedBy.employeeId} on{' '}
              {formatDateTime({ value: verification.modifiedAt })}
            </div>
          </div>
        </div>
      );

    case ParameterVerificationStatus.PENDING:
      return userId !== verification?.requestedTo?.id ? null : (
        <SelfVerificationAction parameterId={parameterId} />
      );

    default:
      return null;
  }
};

export default memo(SelfVerification);
