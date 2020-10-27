import SignningNotCompleted from '#assets/svg/SignningNotCompleted';
import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React, { FC } from 'react';
import styled from 'styled-components';

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
    padding: 80px;

    .not-siggned-icon {
      font-size: 120px;
    }

    .text {
      color: #000000;
      font-size: 20px;
      font-weight: bold;
      margin-top: 24px;
    }
  }
`;

const SignningNotCompleteModal: FC<CommonOverlayProps<any>> = ({
  closeAllOverlays,
  closeOverlay,
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
          <SignningNotCompleted className="not-siggned-icon" />
          <div className="text">
            Sign Off Completed Tasks before Completing the Job
          </div>
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default SignningNotCompleteModal;
