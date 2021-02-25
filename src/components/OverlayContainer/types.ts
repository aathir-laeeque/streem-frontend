import {
  closeAllOverlayAction,
  closeOverlayAction,
  openOverlayAction,
  updatePropsAction,
} from './actions';

export enum OverlayNames {
  ADD_STOP = 'ADD_STOP',
  ARCHIVE_MODAL = 'ARCHIVE_MODAL',
  ASSIGNED_USER_DETAIL = 'ASSIGNED_USER_DETAIL',
  ASSIGNMENT_SUCCESS = 'ASSIGNMENT_SUCCESS',
  AUTHORS_DETAIL = 'AUTHORS_DETAIL',
  CHECKLIST_INFO = 'CHECKLIST_INFO',
  CHECKLIST_REVIEWER_ASSIGNMENT = 'CHECKLIST_REVIEWER_ASSIGNMENT',
  CHECKLIST_REVIEWER_ASSIGNMENT_POPOVER = 'CHECKLIST_REVIEWER_ASSIGNMENT_POPOVER',
  CHECKLIST_REVIEWER_ASSIGNMENT_SUCCESS = 'CHECKLIST_REVIEWER_ASSIGNMENT_SUCCESS',
  CHECKLIST_REVIEWER_SUBMIT_SUCCESS = 'CHECKLIST_REVIEWER_SUBMIT_SUCCESS',
  CHECKLIST_SENT_TO_AUTHOR_SUCCESS = 'CHECKLIST_SENT_TO_AUTHOR_SUCCESS',
  COMPLETE_JOB_WITH_EXCEPTION = 'COMPLETE_JOB_WITH_EXCEPTION',
  COMPLETE_TASK_WITH_EXCEPTION = 'COMPLETE_TASK_WITH_EXCEPTION',
  CONFIRMATION_MODAL = 'CONFIRMATION_MODAL',
  CREATE_JOB_MODAL = 'CREATE_JOB_MODAL',
  JOB_USER_ASSIGN = 'JOB_USER_ASSIGN',
  SIGNATURE_MODAL = 'SIGNATURE_MODAL',
  SIGNNING_NOT_COMPLETE = 'SIGNNING_NOT_COMPLETE',
  SIGN_COMPLETED_TASKS = 'SIGN_COMPLETED_TASKS',
  SIGN_OFF_INITIATED_SUCCESS = 'SIGN_OFF_INITIATED_SUCCESS',
  SIGN_OFF_PROGRESS = 'SIGN_OFF_PROGRESS',
  SIGN_OFF_STATE = 'SIGN_OFF_STATE',
  SIGN_OFF_SUCCESS = 'SIGN_OFF_SUCCESS',
  SIMPLE_CONFIRMATION_MODAL = 'SIMPLE_CONFIRMATION_MODAL',
  SKIP_TASK_MODAL = 'SKIP_TASK_MODAL',
  START_JOB_MODAL = 'START_JOB_MODAL',
  SUBMIT_REVIEW_MODAL = 'SUBMIT_REVIEW_MODAL',
  TASK_ERROR_CORRECTION = 'TASK_ERROR_CORRECTION',
  TASK_MEDIA = 'TASK_MEDIA',
  TASK_USERS_ASSIGNMENT = 'TASK_USERS_ASSIGNMENT',
  TASK_USER_ASSIGNMENT = 'TASK_USER_ASSIGNMENT',
  TIMED_TASK_CONFIG = 'TIMED_TASK_CONFIG',
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
  CLOSE_ALL_OVERLAY = '@@overlay/Container/CLOSE_ALL_OVERLAY',
  CLOSE_OVERLAY = '@@overlay/Container/CLOSE_OVERLAY',
  OPEN_OVERLAY = '@@overlay/Container/OPEN_OVERLAY',
  UPDATE_PROPS = '@@overlay/Container/UPDATE_PROPS',
}

export interface OverlayContainerState {
  readonly currentOverlays: Overlay[];
}

export type OverlayContainerActionType = ReturnType<
  | typeof closeAllOverlayAction
  | typeof closeOverlayAction
  | typeof openOverlayAction
  | typeof updatePropsAction
>;
