import { BaseModal } from '#components';
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
        color: #333333;
      }
    }
  }
`;

type AssignmentSuccessModalProps = {
  closeAllModals: () => void;
  closeModal: () => void;
  notify: boolean;
};

const AssignmentSuccessModal: FC<AssignmentSuccessModalProps> = ({
  closeAllModals,
  closeModal,
  notify,
}) => {
  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        showFooter={false}
        showHeader={false}
        title="Start a Job"
      >
        <MemoUserAssigned fontSize={300} style={{ height: '205px' }} />
        <h3>User Assigned</h3>
        <span>
          {notify
            ? 'Selected users will be notified'
            : 'Selected users can execute the task'}
        </span>
      </BaseModal>
    </Wrapper>
  );
};

export default AssignmentSuccessModal;