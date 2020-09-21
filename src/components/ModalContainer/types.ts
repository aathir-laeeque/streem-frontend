import {
  openModalAction,
  closeModalAction,
  closeAllModalAction,
} from './actions';

export enum ModalNames {
  CREATE_JOB_MODAL = 'CREATE_JOB_MODAL',
  JOB_USER_ASSIGN = 'JOB_USER_ASSIGN',
  SIGNATURE_MODAL = 'SIGNATURE_MODAL',
  CONFIRMATION_MODAL = 'CONFIRMATION_MODAL',
  START_JOB_MODAL = 'START_JOB_MODAL',
  SKIP_TASK_MODAL = 'SKIP_TASK_MODAL',
  COMPLETE_TASK_WITH_EXCEPTION = 'COMPLETE_TASK_WITH_EXCEPTION',
  COMPLETE_JOB_WITH_EXCEPTION = 'COMPLETE_JOB_WITH_EXCEPTION',
  TASK_ERROR_CORRECTION = 'TASK_ERROR_CORRECTION',
  MEDIA_DETAIL = 'MEDIA_DETAIL',
  ADD_STOP = 'ADD_STOP',
  TASK_USER_ASSIGNMENT = 'TASK_USER_ASSIGNMENT',
  ASSIGNMENT_SUCCESS = 'ASSIGNMENT_SUCCESS',
}

export interface Modal {
  type: string;
  props: Record<string, any>;
}

export interface ModalContainerProps {
  currentModals: Modal[];
  closeModal: () => void;
  closeAllModals: () => void;
}

export enum ModalContainerAction {
  OPEN_MODAL = '@@modal/Container/OPEN_MODAL',
  CLOSE_MODAL = '@@modal/Container/CLOSE_MODAL',
  CLOSE_ALL_MODAL = '@@modal/Container/CLOSE_ALL_MODAL',
}

export interface ModalContainerState {
  readonly currentModals: { type: string; props: Record<string, any> }[];
}

export type ModalContainerActionType = ReturnType<
  typeof openModalAction | typeof closeModalAction | typeof closeAllModalAction
>;
