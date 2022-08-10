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
  EDITING_DISABLED = 'EDITING_DISABLED',
  INITIATE_SIGNOFF = 'INITIATE_SIGNOFF',
  JOB_USER_ASSIGN = 'JOB_USER_ASSIGN',
  PARAMETER_APPROVAL = 'PARAMETER_APPROVAL',
  PASSWORD_INPUT = 'PASSWORD_INPUT',
  RELEASE_SUCCESS = 'RELEASE_SUCCESS',
  REVIEWERS_DETAIL = 'REVIEWERS_DETAIL',
  REVISION_ERROR = 'REVISION_ERROR',
  SESSION_EXPIRE = 'SESSION_EXPIRE',
  SHOW_COMPLETED_JOB_WITH_EXCEPTION_INFO = 'SHOW_COMPLETED_JOB_WITH_EXCEPTION_INFO',
  SIGNATURE_MODAL = 'SIGNATURE_MODAL',
  SIGNNING_NOT_COMPLETE = 'SIGNNING_NOT_COMPLETE',
  SIGN_COMPLETED_TASKS = 'SIGN_COMPLETED_TASKS',
  SIGN_OFF_INITIATED_SUCCESS = 'SIGN_OFF_INITIATED_SUCCESS',
  SIGN_OFF_PROGRESS = 'SIGN_OFF_PROGRESS',
  SIGN_OFF_STATE = 'SIGN_OFF_STATE',
  SIGN_OFF_SUCCESS = 'SIGN_OFF_SUCCESS',
  SIMPLE_CONFIRMATION_MODAL = 'SIMPLE_CONFIRMATION_MODAL',
  START_JOB_MODAL = 'START_JOB_MODAL',
  START_JOB_ERROR_MODAL = 'START_JOB_ERROR_MODAL',
  START_TASK_ERROR_MODAL = 'START_TASK_ERROR_MODAL',
  SKIP_TASK_MODAL = 'SKIP_TASK_MODAL',
  SUBMIT_REVIEW_MODAL = 'SUBMIT_REVIEW_MODAL',
  TASK_ERROR_CORRECTION = 'TASK_ERROR_CORRECTION',
  TASK_MEDIA = 'TASK_MEDIA',
  TIMED_TASK_CONFIG = 'TIMED_TASK_CONFIG',
  SECRET_KEY_MODAL = 'SECRET_KEY_MODAL',
  VALIDATE_CREDENTIALS_MODAL = 'VALIDATE_CREDENTIALS_MODAL',
  USER_ASSIGNMENT = 'USER_ASSIGNMENT',
  CHECKLIST_USER_ASSIGNMENT = 'CHECKLIST_USER_ASSIGNMENT',
  ASSIGNMENT_INFO = 'ASSIGNMENT_INFO',
  ENTITY_START_ERROR_MODAL = 'ENTITY_START_ERROR_MODAL',
  REASON_MODAL = 'REASON_MODAL',
  JOB_COMPLETE_ALL_TASKS_ERROR = 'JOB_COMPLETE_ALL_TASKS_ERROR',
  WEBCAM_OVERLAY = 'WEBCAM_OVERLAY',
  REFETCH_JOB_COMPOSER_DATA = 'REFETCH_JOB_COMPOSER_DATA',
  CALC_ACTIVITY_ADD_PARAMS_MODAL = 'CALC_ACTIVITY_ADD_PARAMS_MODAL',
}

export interface CommonOverlayProps<T> {
  type: OverlayNames;
  props: T;
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
