import { BaseModal } from '#components';
import { Task } from '#Composer/cehcklist.types';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { completeTask } from '../TaskList/actions';

const Wrapper = styled.div`
  .modal-body {
    color: #666666;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    padding: 16px;
  }
`;

type CompleteTaskWithExceptionModalProps = {
  closeAllModals: () => void;
  closeModal: () => void;
  taskId: Task['id'];
};

const CompleteTaskWithExceptionModal: FC<CompleteTaskWithExceptionModalProps> = ({
  closeAllModals,
  closeModal,
  taskId,
}) => {
  const dispatch = useDispatch();

  const [exceptionReason, setExceptionReason] = useState('');

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        onPrimary={() => {
          dispatch(completeTask(taskId, exceptionReason, true));
          closeModal();
        }}
        onSecondary={() => closeModal()}
        primaryText="Submit"
        secondaryText="Cancel"
        title="Complete with Exception"
      >
        <div className="new-form-field">
          <label className="new-form-field-label">
            Provide the detials for Exception
          </label>
          <textarea
            className="new-form-field-textarea"
            value={exceptionReason}
            onChange={(e) => setExceptionReason(e.target.value)}
            rows={4}
            placeholder="Exception Reason"
          />
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default CompleteTaskWithExceptionModal;
