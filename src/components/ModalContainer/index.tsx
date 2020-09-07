import CompleteJobWithExceptionModal from '#Composer/modals/CompleteJobWithException';
import StartJobModal from '#Composer/StartJobModal';
import CompletetaskWithException from '#Composer/TaskList/TaskView/TaskCard/CompleteWithException';
import SkipTaskModal from '#Composer/TaskList/TaskView/TaskCard/SkipTaskModal';
import { useTypedSelector } from '#store';
import { SignatureModal } from '#views/Checklists/ChecklistComposer/TaskList/TaskView/ActivityList/Activity/Signature/SignatureModal';
import { CreateJobModal } from '#views/Jobs/Modals/CreateJobModal';
import { JobUserAssignModal } from '#views/Jobs/Modals/JobUserAssignModal';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { closeAllModalAction, closeModalAction } from './actions';
import { ConfirmationModal } from './ConfirmationModal';
import { ModalNames } from './types';

const Wrapper = styled.div``;

const getModal = (
  type: string,
  props: any,
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
    case ModalNames.SIGNATURE_MODAL:
      return (
        <SignatureModal
          {...props}
          user={props.user}
          onAcceptSignature={props.onAcceptSignature}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.SIGNATURE_MODAL, ...args)
          }
          key={i}
        />
      );
    case ModalNames.CONFIRMATION_MODAL:
      return (
        <ConfirmationModal
          {...props}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.CONFIRMATION_MODAL, ...args)
          }
          key={i}
        />
      );

    case ModalNames.START_JOB_MODAL:
      return (
        <StartJobModal
          {...props}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.START_JOB_MODAL, ...args)
          }
          key={i}
        />
      );

    case ModalNames.SKIP_TASK_MODAL:
      return (
        <SkipTaskModal
          {...props}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.SKIP_TASK_MODAL, ...args)
          }
          key={i}
        />
      );

    case ModalNames.COMPLETE_TASK_WITH_EXCEPTION:
      return (
        <CompletetaskWithException
          {...props}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.COMPLETE_TASK_WITH_EXCEPTION, ...args)
          }
          key={i}
        />
      );

    case ModalNames.COMPLETE_JOB_WITH_EXCEPTION:
      return (
        <CompleteJobWithExceptionModal
          {...props}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.COMPLETE_JOB_WITH_EXCEPTION, ...args)
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
