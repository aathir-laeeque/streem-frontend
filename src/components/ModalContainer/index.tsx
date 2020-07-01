import { useTypedSelector } from '#store';
import { CreateTaskModal } from '#views/Tasks/Modals/CreateTaskModal';
import { TaskUserAssignModal } from '#views/Tasks/Modals/TaskUserAssignModal';
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
    case ModalNames.CREATE_TASK_MODAL:
      return (
        <CreateTaskModal
          {...props}
          properties={props.properties}
          selectedChecklist={props.selectedChecklist}
          onCreateTask={props.onCreateTask}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.CREATE_TASK_MODAL, ...args)
          }
          key={i}
        />
      );
    case ModalNames.TASK_USER_ASSIGN:
      return (
        <TaskUserAssignModal
          {...props}
          users={props.users}
          selectedTask={props.selectedTask}
          onAssignTask={props.onAssignTask}
          closeAllModals={closeAllModals}
          closeModal={(...args) =>
            closeModal(ModalNames.TASK_USER_ASSIGN, ...args)
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
