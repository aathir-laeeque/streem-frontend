import { ParameterVerificationTypeEnum } from '#PrototypeComposer/checklist.types';
import { ParameterState } from '#types';
import { isEqual } from 'lodash';
import React, { FC, memo } from 'react';
import PeerVerification from './PeerVerification';
import SelfVerification from './SelfVerification';

const ParameterVerificationView: FC<{
  isLoggedInUserAssigned?: boolean;
  parameterState: ParameterState;
  verificationsByType: any;
  verificationType: string;
  parameterId: string;
  modifiedBy: string;
}> = ({
  isLoggedInUserAssigned,
  parameterState,
  verificationsByType,
  verificationType,
  parameterId,
  modifiedBy,
}) => {
  const renderVerificationView = () => {
    switch (verificationType) {
      case ParameterVerificationTypeEnum.SELF:
        return (
          <SelfVerification
            parameterId={parameterId}
            verification={verificationsByType?.[ParameterVerificationTypeEnum.SELF]}
            isLoggedInUserAssigned={isLoggedInUserAssigned}
            parameterState={parameterState}
            modifiedBy={modifiedBy}
          />
        );
      case ParameterVerificationTypeEnum.PEER:
        return (
          <PeerVerification
            parameterId={parameterId}
            verifications={verificationsByType}
            verificationType={verificationType}
            isLoggedInUserAssigned={isLoggedInUserAssigned}
            parameterState={parameterState}
            modifiedBy={modifiedBy}
          />
        );
      case ParameterVerificationTypeEnum.BOTH:
        return (
          <>
            <SelfVerification
              parameterId={parameterId}
              verification={verificationsByType?.[ParameterVerificationTypeEnum.SELF]}
              isLoggedInUserAssigned={isLoggedInUserAssigned}
              parameterState={parameterState}
              modifiedBy={modifiedBy}
            />
            <PeerVerification
              parameterId={parameterId}
              verificationType={verificationType}
              verifications={verificationsByType}
              isLoggedInUserAssigned={isLoggedInUserAssigned}
              parameterState={parameterState}
              modifiedBy={modifiedBy}
            />
          </>
        );
      default:
        return null;
    }
  };

  return !verificationType || verificationType === ParameterVerificationTypeEnum.NONE
    ? null
    : renderVerificationView();
};

export default memo(ParameterVerificationView, (prev, next) => {
  return (
    prev.parameterState === next.parameterState &&
    prev.modifiedBy === next.modifiedBy &&
    isEqual(prev.verificationsByType, next.verificationsByType)
  );
});
