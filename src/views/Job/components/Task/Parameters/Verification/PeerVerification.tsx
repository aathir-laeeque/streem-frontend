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
import { useJobStateToFlags } from '#views/Job/utils';

type PeerVerificationProps = {
  parameterResponseId: string;
  verificationType: ParameterVerificationTypeEnum | ParameterVerificationTypeEnum.BOTH;
  verifications: Dictionary<Verification>;
  isLoggedInUserAssigned?: boolean;
  parameterState: ParameterState;
  modifiedBy: string;
};

const PeerVerification: FC<PeerVerificationProps> = ({
  parameterResponseId,
  verificationType,
  verifications,
  isLoggedInUserAssigned,
  parameterState,
  modifiedBy,
}) => {
  const {
    auth: { userId },
  } = useTypedSelector((state) => state);

  const { isCompletedWithException, isTaskCompletedWithException } = useJobStateToFlags();
  const dispatch = useDispatch();
  const verification = verifications?.[ParameterVerificationTypeEnum.PEER];
  let showVerification = true;

  if (
    (isCompletedWithException || isTaskCompletedWithException) &&
    verification?.verificationStatus !== ParameterVerificationStatus.ACCEPTED &&
    verification?.verificationStatus !== ParameterVerificationStatus.REJECTED
  )
    return null;

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
      [userId, '1'].includes(modifiedBy) &&
      isLoggedInUserAssigned &&
      !isCompletedWithException &&
      !isTaskCompletedWithException &&
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
                        jobActions.sendPeerVerification({
                          parameterResponseId,
                          userId: data.value,
                        }),
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
              <PeerVerificationAction parameterResponseId={parameterResponseId} />
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
                              jobActions.recallPeerVerification({
                                parameterResponseId,
                                type: 'peer',
                              }),
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
