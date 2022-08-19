import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Task } from '#JobComposer/checklist.types';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { enableErrorCorrection } from '../TaskList/actions';

const Wrapper = styled.div`
  .modal-body {
    color: #666666;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    padding: 16px;
  }
`;

const ErrorCorrectionModal: FC<CommonOverlayProps<{
  taskId: Task['id'];
  setLoadingState: React.Dispatch<React.SetStateAction<boolean>>;
}>> = ({
  closeAllOverlays,
  closeOverlay,
  props: { taskId, setLoadingState },
}) => {
  const dispatch = useDispatch();

  const [correctionReason, setCorrectionReason] = useState('');

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        onPrimary={() => {
          setLoadingState(true);
          dispatch(
            enableErrorCorrection(taskId, correctionReason, setLoadingState),
          );
          closeOverlay();
        }}
        onSecondary={() => closeOverlay()}
        primaryText="Submit"
        secondaryText="Cancel"
        title="Error Correction"
        disabledPrimary={!correctionReason}
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
