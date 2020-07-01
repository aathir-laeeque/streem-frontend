import {
  openModalAction,
  closeModalAction,
  closeAllModalAction,
} from './actions';

export enum ModalNames {
  CREATE_TASK_MODAL = 'CREATE_TASK_MODAL',
  TASK_USER_ASSIGN = 'TASK_USER_ASSIGN',
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
