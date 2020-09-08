import { BaseModal } from '#components';
import { Task } from '#Composer/checklist.types';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { enableErrorCorrection } from '../../actions';

const Wrapper = styled.div`
  .modal-body {
    color: #666666;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    padding: 16px;
  }
`;

type ErrorCorrectionModalProps = {
  closeAllModals: () => void;
  closeModal: () => void;
  taskId: Task['id'];
};

const ErrorCorrectionModal: FC<ErrorCorrectionModalProps> = ({
  closeAllModals,
  closeModal,
  taskId,
}) => {
  const dispatch = useDispatch();

  const [correctionReason, setCorrectionReason] = useState('');

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        onPrimary={() =>
          dispatch(enableErrorCorrection(taskId, correctionReason))
        }
        onSecondary={() => closeModal()}
        primaryText="Submit"
        secondaryText="Cancel"
        title="Error Correction"
      >
        <div className="new-form-field">
          <label className="new-form-field-label">
            You need to submit a reason to proceed to make changes
          </label>
          <textarea
            className="new-form-field-textarea"
            value={correctionReason}
            onChange={(e) => setCorrectionReason(e.target.value)}
            rows={4}
            placeholder="Error Correction Reason"
          />
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default ErrorCorrectionModal;
