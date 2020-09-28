import {
  openOverlayAction,
  closeOverlayAction,
  closeAllOverlayAction,
} from './actions';

export enum OverlayNames {
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
  TASK_USERS_ASSIGNMENT = 'TASK_USERS_ASSIGNMENT',
  ASSIGNMENT_SUCCESS = 'ASSIGNMENT_SUCCESS',
  TASK_USER_ASSIGNMENT = 'TASK_USER_ASSIGNMENT',
  ASSIGNED_USER_DETAIL = 'ASSIGNED_USER_DETAIL',
}

export interface CommonOverlayProps<T> {
  type: string;
  props?: T;
  key: string;
  closeOverlay: () => void;
  closeAllOverlays: () => void;
  popOverAnchorEl?: Element | ((element: Element) => Element);
}

export interface Overlay {
  type: OverlayNames;
  props?: Record<string, any>;
  popOverAnchorEl?: Element | ((element: Element) => Element);
}

export interface OverlayContainerProps {
  currentOverlays: Overlay[];
  closeOverlay: () => void;
  closeAllOverlays: () => void;
}

export enum OverlayContainerAction {
  OPEN_OVERLAY = '@@overlay/Container/OPEN_OVERLAY',
  CLOSE_OVERLAY = '@@overlay/Container/CLOSE_OVERLAY',
  CLOSE_ALL_OVERLAY = '@@overlay/Container/CLOSE_ALL_OVERLAY',
}

export interface OverlayContainerState {
  readonly currentOverlays: Overlay[];
}

export type OverlayContainerActionType = ReturnType<
  | typeof openOverlayAction
  | typeof closeOverlayAction
  | typeof closeAllOverlayAction
>;
