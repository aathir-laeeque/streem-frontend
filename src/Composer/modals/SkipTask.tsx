import { BaseModal } from '#components';
import { Task } from '#Composer/checklist.types';
import { CommonOverlayProps } from '#components/OverlayContainer/types';
import React, { FC, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { skipTask } from '../TaskList/actions';

const Wrapper = styled.div`
  .modal-body {
    color: #666666;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    padding: 16px;
  }
`;

const SkipTaskModal: FC<CommonOverlayProps<{
  taskId: Task['id'];
}>> = ({ closeAllOverlays, closeOverlay, props: { taskId } }) => {
  const dispatch = useDispatch();

  const [skipReason, setSkipReason] = useState('');

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllOverlays}
        closeModal={closeOverlay}
        onPrimary={() => dispatch(skipTask(taskId, skipReason))}
        onSecondary={() => closeOverlay()}
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
