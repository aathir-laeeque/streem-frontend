import { AppDispatch, useTypedSelector } from '#store';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { closeModalAction, closeAllModalAction } from './actions';
import { CreateTaskModal } from './components/CreateTaskModal';
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
          onInputChange={props.onInputChange}
          taskDetails={props.taskDetails}
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

    default:
      return null;
  }
};

const ModalContainer: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentModals } = useTypedSelector((state) => state.ModalContainer);
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
