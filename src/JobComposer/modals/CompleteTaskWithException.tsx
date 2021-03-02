import { BaseModal } from '#components';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import { Task } from '#JobComposer/checklist.types';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { completeTask } from '../TaskList/actions';

const Wrapper = styled.div`
  .modal {
    min-width: 460px !important;

    &-header {
      padding: 24px !important;
      border-bottom: none !important;

      h2 {
        color: #000000 !important;
        font-weight: bold !important;
      }
    }

    &-body {
      padding: 0px 24px !important;

      label {
        align-self: flex-start;
      }
    }

    &-footer {
      padding: 24px !important;
      border-top: none !important;
    }
  }
`;

const CompleteTaskWithExceptionModal: FC<CommonOverlayProps<{
  taskId: Task['id'];
}>> = ({ closeAllOverlays, closeOverlay, props: { taskId } }) => {
  const dispatch = useDispatch();

  const [exceptionReason, setExceptionReason] = useState('');

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        onPrimary={() => {
          dispatch(completeTask(taskId, exceptionReason, true));
          closeOverlay();
        }}
        onSecondary={() => closeOverlay()}
        primaryText="Submit"
        secondaryText="Cancel"
        title="Complete with Exception"
      >
        <div className="new-form-field">
          <label className="new-form-field-label">
            Provide the details for Exception
          </label>
          <textarea
            className="new-form-field-textarea"
            value={exceptionReason}
            onChange={(e) => setExceptionReason(e.target.value)}
            rows={4}
            placeholder="Exception Reason"
            autoFocus={true}
          />
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default CompleteTaskWithExceptionModal;
