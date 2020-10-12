import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import MemoUserAssigned from '#assets/svg/UserAssigned';
import React, { FC } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  .modal {
    min-width: 400px !important;

    .modal-body {
      padding: 54px 50px !important;
      justify-content: center;
      align-items: center;
      display: flex;
      flex-direction: column;

      > h3 {
        font-size: 20px;
        font-weight: bold;
        color: #000000;
        margin: 32px 0px 8px 0px;
      }

      > span {
        font-size: 14px;
        color: #000;
      }
    }
  }
`;

const ReviewSubmitSuccessModal: FC<CommonOverlayProps<any>> = ({
  closeAllOverlays,
  closeOverlay,
}) => {
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        showFooter={false}
        showHeader={false}
      >
        <MemoUserAssigned fontSize={300} style={{ height: '205px' }} />
        <h3>Great Job</h3>
        <span>Your other team members are still reviewing the checklist. </span>
      </BaseModal>
    </Wrapper>
  );
};

export default ReviewSubmitSuccessModal;
