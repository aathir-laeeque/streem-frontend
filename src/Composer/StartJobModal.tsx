import { BaseModal } from '#components';
import { Task } from '#Composer/checklist.types';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Job } from '../views/Jobs/types';
import { startTask } from './TaskList/actions';
import { startJob } from './actions';

const Wrapper = styled.div`
  .modal-body {
    color: #666666;
    display: flex;
    flex-direction: column;
    font-size: 16px;
    padding: 16px;
  }
`;

type StartJobModalProps = {
  closeAllModals: () => void;
  closeModal: () => void;
  taskId: Task['id'];
  jobId: Job['id'];
};

const StartJobModal: FC<StartJobModalProps> = ({
  closeAllModals,
  closeModal,
  taskId,
  jobId,
}) => {
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <BaseModal
        closeAllModals={closeAllModals}
        closeModal={closeModal}
        onPrimary={() => {
          dispatch(startJob(jobId));

          dispatch(startTask(taskId));
        }}
        onSecondary={() => closeModal()}
        primaryText="Start Job"
        secondaryText="Go Back"
        title="Start a Job"
      >
        <div className="modal-body">
          You need to start this job first in order to execute it. Do you want
          to start this job now?
        </div>
      </BaseModal>
    </Wrapper>
  );
};

export default StartJobModal;
