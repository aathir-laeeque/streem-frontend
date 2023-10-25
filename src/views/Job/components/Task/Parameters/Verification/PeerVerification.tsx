import { ParameterVerificationTypeEnum } from '#PrototypeComposer/checklist.types';
import PeerVerifiedIcon from '#assets/svg/peerVerifiedIcon.svg';
import peerRejectedIcon from '#assets/svg/rejected-icon.svg';
import { Button } from '#components';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { useTypedSelector } from '#store/helpers';
import { ParameterState, ParameterVerificationStatus } from '#types';
import { getFullName } from '#utils/stringUtils';
import { formatDateTime } from '#utils/timeUtils';
import { jobActions } from '#views/Job/jobStore';
import { Verification } from '#views/Jobs/ListView/types';
import { Dictionary } from 'lodash';
import React, { FC, memo } from 'react';
import { useDispatch } from 'react-redux';
import PeerVerificationAction from './PeerVerificationAction';

type PeerVerificationProps = {
  parameterId: string;
  verificationType: ParameterVerificationTypeEnum | ParameterVerificationTypeEnum.BOTH;
  verifications: Dictionary<Verification>;
  isLoggedInUserAssigned?: boolean;
  parameterState: ParameterState;
  modifiedBy: string;
};

const PeerVerification: FC<PeerVerificationProps> = ({
  parameterId,
  verificationType,
  verifications,
  isLoggedInUserAssigned,
  parameterState,
  modifiedBy,
}) => {
  const {
    auth: { userId },
  } = useTypedSelector((state) => state);
  const dispatch = useDispatch();
  const verification = verifications?.[ParameterVerificationTypeEnum.PEER];
  let showVerification = true;

  if (
    (verificationType === ParameterVerificationTypeEnum.BOTH &&
      verifications?.[ParameterVerificationTypeEnum.SELF]?.verificationStatus !==
        ParameterVerificationStatus.ACCEPTED) ||
    verifications?.[ParameterVerificationTypeEnum.SELF]?.evaluationState ===
      ParameterState.BEING_EXECUTED
  ) {
    showVerification = false;
  }

  if (!showVerification) {
    return null;
  }

  const renderByParameterState = () => {
    if (
      modifiedBy === userId &&
      isLoggedInUserAssigned &&
      (parameterState === ParameterState.BEING_EXECUTED ||
        parameterState === ParameterState.VERIFICATION_PENDING)
    )
      return (
        <div className="parameter-verification">
          <Button
            onClick={() => {
              dispatch(
                openOverlayAction({
                  type: OverlayNames.PEER_VERIFICATION_MODAL,
                  props: {
                    onSubmit: (data: any) =>
                      dispatch(
                        jobActions.sendPeerVerification({ parameterId, userId: data.value }),
                      ),
                  },
                }),
              );
            }}
          >
            Request Verification
          </Button>
        </div>
      );
  };

  const renderByVerificationState = () => {
    switch (verification?.verificationStatus) {
      case ParameterVerificationStatus.PENDING:
        return userId === verification?.createdBy?.id || verification?.requestedTo?.id ? (
          <div>
            {verification?.requestedTo?.id === userId ? (
              <PeerVerificationAction parameterId={parameterId} />
            ) : verification?.createdBy?.id === userId ? (
              <div className="parameter-verification">
                <Button
                  onClick={() => {
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.RECALL_VERIFICATION_MODAL,
                        props: {
                          modalTitle: 'Recall From Verification',
                          modalDesc: `Are you sure you want to Recall from verification ?`,
                          onSubmitHandler: () =>
                            dispatch(
                              jobActions.recallPeerVerification({ parameterId, type: 'peer' }),
                            ),
                        },
                      }),
                    );
                  }}
                >
                  Recall Verification
                </Button>
              </div>
            ) : null}
          </div>
        ) : null;

      case ParameterVerificationStatus.ACCEPTED:
        return (
          <div className="parameter-audit">
            <div className="parameter-verified">
              <img src={PeerVerifiedIcon} alt="Peer Verified" />
              <div>
                Peer Verification approved by {getFullName(verification.modifiedBy)}, ID:{' '}
                {verification.modifiedBy.employeeId} on{' '}
                {formatDateTime({ value: verification.modifiedAt })}.
              </div>
            </div>
          </div>
        );
      case ParameterVerificationStatus.REJECTED:
        return (
          <div className="parameter-audit">
            <div className="parameter-verified">
              <img src={peerRejectedIcon} alt="Peer rejected" />
              <div>
                Peer Verification has been rejected by {getFullName(verification.modifiedBy)}, ID:{' '}
                {verification.modifiedBy.employeeId} on{' '}
                {formatDateTime({ value: verification.modifiedAt })}.{' '}
                <span
                  onClick={() => {
                    dispatch(
                      openOverlayAction({
                        type: OverlayNames.VIEW_REASON,
                        props: {
                          rejectedBy: verification.modifiedBy,
                          reason: verification.comments,
                        },
                      }),
                    );
                  }}
                >
                  View Reason
                </span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {renderByParameterState()}
      {renderByVerificationState()}
    </>
  );
};

export default memo(PeerVerification);
