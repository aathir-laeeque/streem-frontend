import { ParameterExecutionState } from '#JobComposer/checklist.types';
import selfVerifiedIcon from '#assets/svg/self-verified-icon.svg';
import { Button } from '#components';
import { useTypedSelector } from '#store';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import React, { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import { initiateSelfVerification } from '../actions';
import { ParameterVerificationStatus } from '../types';
import SelfVerificationAction from './SelfVerificationAction';
import { JobStateEnum } from '#views/Jobs/ListView/types';

const SelfVerification: FC<{
  parameterId: string;
  verification: any;
  isLoggedInUserAssigned: boolean;
  parameterState: string;
  modifiedBy: string;
}> = ({ parameterId, verification, isLoggedInUserAssigned, parameterState, modifiedBy }) => {
  const dispatch = useDispatch();
  const {
    auth: { userId },
    composer: { jobState },
  } = useTypedSelector((state) => state);

  const SelfVerifyButton = () => {
    if (modifiedBy === userId)
      return (
        <div className="parameter-verification">
          <Button
            onClick={() => {
              dispatch(initiateSelfVerification({ parameterId }));
            }}
          >
            Self Verify
          </Button>
        </div>
      );
    return null;
  };

  if (
    jobState === JobStateEnum.COMPLETED_WITH_EXCEPTION &&
    verification?.verificationStatus !== ParameterVerificationStatus.ACCEPTED
  )
    return null;

  if (parameterState === ParameterExecutionState.BEING_EXECUTED && isLoggedInUserAssigned) {
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
              {verification.modifiedBy.employeeId} on {formatDateTime(verification.modifiedAt)}
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
