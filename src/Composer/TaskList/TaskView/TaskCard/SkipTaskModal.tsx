import { BaseModal } from '#components';
import { Task } from '#Composer/checklist.types';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { skipTask } from '../../actions';

const Wrapper = styled.div`
  .modal-body {
    color: #666666;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    padding: 16px;
  }
`;

type SkipTaskModalProps = {
  closeAllModals: () => void;
  closeModal: () => void;
  taskId: Task['id'];
};

const SkipTaskModal: FC<SkipTaskModalProps> = ({
  closeAllModals,
  closeModal,
  taskId,
}) => {
  const dispatch = useDispatch();

  const [skipReason, setSkipReason] = useState('');

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        onPrimary={() => dispatch(skipTask(taskId, skipReason))}
        onSecondary={() => closeModal()}
        primaryText="Submit"
        secondaryText="Cancel"
        title="Skip Task"
      >
        <div className="new-form-field">
          <label className="new-form-field-label">
            Provide the detials for skipping the task
          </label>
          <textarea
            className="new-form-field-textarea"
            value={skipReason}
            onChange={(e) => setSkipReason(e.target.value)}
            rows={4}
            placeholder="Skip reason"
          />
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default SkipTaskModal;
