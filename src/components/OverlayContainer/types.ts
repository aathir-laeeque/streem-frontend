import {
  openOverlayAction,
  closeOverlayAction,
  closeAllOverlayAction,
  updatePropsAction,
} from './actions';

export enum OverlayNames {
  ADD_STOP = 'ADD_STOP',
  ASSIGNED_USER_DETAIL = 'ASSIGNED_USER_DETAIL',
  ASSIGNMENT_SUCCESS = 'ASSIGNMENT_SUCCESS',
  COMPLETE_JOB_WITH_EXCEPTION = 'COMPLETE_JOB_WITH_EXCEPTION',
  COMPLETE_TASK_WITH_EXCEPTION = 'COMPLETE_TASK_WITH_EXCEPTION',
  CONFIRMATION_MODAL = 'CONFIRMATION_MODAL',
  CREATE_JOB_MODAL = 'CREATE_JOB_MODAL',
  JOB_USER_ASSIGN = 'JOB_USER_ASSIGN',
  MEDIA_DETAIL = 'MEDIA_DETAIL',
  SIGNATURE_MODAL = 'SIGNATURE_MODAL',
  SIMPLE_CONFIRMATION_MODAL = 'SIMPLE_CONFIRMATION_MODAL',
  START_JOB_MODAL = 'START_JOB_MODAL',
  SKIP_TASK_MODAL = 'SKIP_TASK_MODAL',
  TASK_ERROR_CORRECTION = 'TASK_ERROR_CORRECTION',
  TASK_MEDIA = 'TASK_MEDIA',
  TASK_USER_ASSIGNMENT = 'TASK_USER_ASSIGNMENT',
  CHECKLIST_REVIEWER_ASSIGNMENT = 'CHECKLIST_REVIEWER_ASSIGNMENT',
  CHECKLIST_REVIEWER_ASSIGNMENT_SUCCESS = 'CHECKLIST_REVIEWER_ASSIGNMENT_SUCCESS',
  SUBMIT_REVIEW_MODAL = 'SUBMIT_REVIEW_MODAL',
  CHECKLIST_REVIEWER_SUBMIT_SUCCESS = 'CHECKLIST_REVIEWER_SUBMIT_SUCCESS',
  AUTHORS_DETAIL = 'AUTHORS_DETAIL',
  REVIEWERS_DETAIL = 'REVIEWERS_DETAIL',
  CHECKLIST_REVIEWER_ASSIGNMENT_POPOVER = 'CHECKLIST_REVIEWER_ASSIGNMENT_POPOVER',
  TASK_USERS_ASSIGNMENT = 'TASK_USERS_ASSIGNMENT',
  TIMED_TASK_CONFIG = 'TIMED_TASK_CONFIG',
  INITIATE_SIGNOFF = 'INITIATE_SIGNOFF',
  SIGN_OFF_PROGRESS = 'SIGN_OFF_PROGRESS',
  PASSWORD_INPUT = 'PASSWORD_INPUT',
}

export interface CommonOverlayProps<T> {
  type: OverlayNames;
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
  UPDATE_PROPS = '@@overlay/Container/UPDATE_PROPS',
}

export interface OverlayContainerState {
  readonly currentOverlays: Overlay[];
}

export type OverlayContainerActionType = ReturnType<
  | typeof openOverlayAction
  | typeof closeOverlayAction
  | typeof closeAllOverlayAction
  | typeof updatePropsAction
>;
