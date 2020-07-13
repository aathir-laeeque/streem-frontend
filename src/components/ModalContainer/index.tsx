import { useTypedSelector } from '#store';
import { CreateJobModal } from '#views/Jobs/Modals/CreateJobModal';
import { JobUserAssignModal } from '#views/Jobs/Modals/JobUserAssignModal';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { closeAllModalAction, closeModalAction } from './actions';
import { ModalNames } from './types';

const Wrapper = styled.div``;

const getModal = (
  type: string,
  props: Record<string, any>,
  closeModal: (name: string) => void,
  i: number,
  closeAllModals: () => void,
) => {
  switch (type) {
    case ModalNames.CREATE_JOB_MODAL:
      return (
        <CreateJobModal
          {...props}
          properties={props.properties}
          selectedChecklist={props.selectedChecklist}
          onCreateJob={props.onCreateJob}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.CREATE_JOB_MODAL, ...args)
          }
          key={i}
        />
      );
    case ModalNames.JOB_USER_ASSIGN:
      return (
        <JobUserAssignModal
          {...props}
          selectedJobIndex={props.selectedJobIndex}
          refreshData={props.refreshData}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.JOB_USER_ASSIGN, ...args)
          }
          key={i}
        />
      );

    default:
      return null;
  }
};

const ModalContainer: FC = () => {
  const dispatch = useDispatch();
  const { currentModals } = useTypedSelector((state) => state.modalContainer);
  const closeModal = (params: string) => {
    dispatch(closeModalAction(params));
  };
  const closeAllModals = () => {
    dispatch(closeAllModalAction());
  };
  return (
    <Wrapper>
      {currentModals &&
        currentModals.map((modal, i) =>
          getModal(modal.type, modal.props, closeModal, i, closeAllModals),
        )}
    </Wrapper>
  );
};

export default ModalContainer;
