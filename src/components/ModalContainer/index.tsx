import CompleteJobWithException from '#Composer/modals/CompleteJobWithException';
import CompleteTaskWithException from '#Composer/modals/CompleteTaskWithException';
import MediaDetail from '#Composer/modals/MediaDetail';
import Signature from '#Composer/modals/SignatureActivity';
import SkipTask from '#Composer/modals/SkipTask';
import TaskUserAssignment from '#Composer/modals/TaskUserAssignment';
import StartJob from '#Composer/modals/StartJob';
import TaskErrorCorrection from '#Composer/modals/TaskErrorCorrection';
import AddStop from '#Composer/modals/AddStop';
import { useTypedSelector } from '#store';
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
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.JOB_USER_ASSIGN, ...args)
          }
          key={i}
        />
      );
    case ModalNames.SIGNATURE_MODAL:
      return (
        <Signature
          {...props}
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
        <StartJob
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
        <SkipTask
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
        <CompleteTaskWithException
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
        <CompleteJobWithException
          {...props}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.COMPLETE_JOB_WITH_EXCEPTION, ...args)
          }
          key={i}
        />
      );

    case ModalNames.TASK_ERROR_CORRECTION:
      return (
        <TaskErrorCorrection
          {...props}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.TASK_ERROR_CORRECTION, ...args)
          }
          key={i}
        />
      );

    case ModalNames.MEDIA_DETAIL:
      return (
        <MediaDetail
          {...props}
          closeAllModals={closeAllModals}
          closeModal={(...args) => closeModal(ModalNames.MEDIA_DETAIL, ...args)}
          key={i}
        />
      );

    case ModalNames.TASK_USER_ASSIGNMENT:
      return (
        <TaskUserAssignment
          {...props}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.TASK_USER_ASSIGNMENT, ...args)
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
      {currentModals.map((modal, i) =>
        getModal(modal.type, modal.props, closeModal, i, closeAllModals),
      )}
    </Wrapper>
  );
};

export default ModalContainer;
