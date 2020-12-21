import { BaseModal } from '../../components';
import { CommonOverlayProps } from '../../components/OverlayContainer/types';
import { ErrorOutline } from '@material-ui/icons';
import React, { FC } from 'react';
import styled from 'styled-components';
import ObservationAccepted from '../../assets/svg/ObservationAccepted';
import ObservationRejected from '../../assets/svg/ObservationRejected';

const Wrapper = styled.div`
  .modal {
    min-width: 420px !important;
    width: 420px !important;
  }

  .modal-body {
    padding: 0 !important;
  }

  .close-icon {
    top: 24px !important;
    right: 32px !important;
  }

  .body {
    padding: 56px;

    > .icon {
      font-size: 120px;
      margin-bottom: 24px;
    }

    .observation {
      &-sent,
      &-approved,
      &-rejected {
        color: #000000;
        font-size: 20px;
        font-weight: bold;
      }

      .rejected-details {
        color: #000000;
        font-size: 14px;
        font-weight: normal;
      }
    }
  }
`;

type Props = {
  observationSent: boolean;
  observationApproved: boolean;
  observationRejected: boolean;
};

const ParameterApprovalModal: FC<CommonOverlayProps<Props>> = ({
  closeAllOverlays,
  closeOverlay,
  props: {
    observationSent = true,
    observationApproved = false,
    observationRejected = false,
  } = {},
}) => {
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showHeader={false}
        showFooter={false}
      >
        <div className="body">
          {(() => {
            if (observationSent) {
              return (
                <>
                  <ObservationAccepted className="icon" />
                  <div className="observation-sent">
                    Observation sent to Supervisor
                  </div>
                </>
              );
            }
            if (observationApproved) {
              return (
                <>
                  <ObservationAccepted className="icon" />
                  <div className="observation-approved">
                    Observation Accepted
                  </div>
                </>
              );
            }
            if (observationRejected) {
              return (
                <>
                  <ObservationRejected className="icon" />
                  <div className="observation-rejected">
                    Observation Rejected
                  </div>
                  <div className="rejected-details">
                    Activity has been reset. It needs to be executed again{' '}
                  </div>
                </>
              );
            }
          })()}
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default ParameterApprovalModal;
