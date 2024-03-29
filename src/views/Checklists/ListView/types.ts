import { JobLogColumnType } from '#PrototypeComposer/checklist.types';
import { Pageable } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';
import { Checklist } from '../types';
import {
  addCustomView,
  addCustomViewError,
  addCustomViewSuccess,
  clearData,
  deleteCustomViewError,
  deleteCustomViewSuccess,
  exportChecklist,
  fetchAutomations,
  fetchAutomationsError,
  fetchAutomationsSuccess,
  fetchChecklists,
  fetchChecklistsError,
  fetchChecklistsOngoing,
  fetchChecklistsSuccess,
  fetchProcessLogs,
  fetchProcessLogsError,
  fetchProcessLogsSuccess,
  getCustomViews,
  getCustomViewsError,
  getCustomViewsSuccess,
  saveCustomView,
  saveCustomViewError,
  saveCustomViewSuccess,
  updateList,
} from './actions';

export type ListViewProps = RouteComponentProps;

export enum AutomationAction {
  CREATE_JOB = 'CREATE_JOB',
}

export enum AutomationVisual {
  CREATE_JOB = 'Create Job',
}

export type Automation = {
  action: AutomationAction;
  cron: string;
};

export type CustomView = {
  id: string;
  columns: JobLogColumnType[];
  filters: any[];
  processId: string;
};
export interface ListViewState {
  readonly checklists: Checklist[];
  readonly currentPageData: Checklist[];
  readonly pageable: Pageable;
  readonly automations: Automation[];
  readonly jobLogs: {
    list: any[];
    loading: boolean;
    pageable: Pageable;
    error?: any;
  };
  readonly customViews: {
    loading: boolean;
    views: Record<string, CustomView>;
  };
  readonly loading: boolean;
  readonly error?: any;
}

export enum ListViewAction {
  CLEAR_DATA = '@@checklist/ListView/CLEAR_DATA',

  FETCH_CHECKLISTS = '@@checklist/ListView/FETCH_CHECKLISTS',
  FETCH_CHECKLISTS_FOR_LISTVIEW = '@@checklist/ListView/FETCH_CHECKLISTS_FOR_LISTVIEW',

  FETCH_CHECKLISTS_ERROR = '@@checklist/ListView/FETCH_CHECKLISTS_ERROR',
  FETCH_CHECKLISTS_ONGOING = '@@checklist/ListView/FETCH_CHECKLISTS_ONGOING',
  FETCH_CHECKLISTS_SUCCESS = '@@checklist/ListView/FETCH_CHECKLISTS_SUCCESS',

  ARCHIVE = '@@checklist/ListView/ARCHIVE',
  HANDLE_PUBLISHED_ARCHIVE = '@@checklist/ListView/HANDLE_PUBLISHED_ARCHIVE',
  UNARCHIVE = '@@checklist/ListView/UNARCHIVE',
  UPDATE_LIST = '@@checklist/ListView/UPDATE_LIST',

  FETCH_AUTOMATIONS = '@@checklist/ListView/FETCH_AUTOMATIONS',
  FETCH_AUTOMATIONS_ERROR = '@@checklist/ListView/FETCH_AUTOMATIONS_ERROR',
  FETCH_AUTOMATIONS_SUCCESS = '@@checklist/ListView/FETCH_AUTOMATIONS_SUCCESS',
  FETCH_PROCESS_LOGS = '@@checklist/ListView/FETCH_PROCESS_LOGS',
  FETCH_PROCESS_LOGS_ERROR = '@@checklist/ListView/FETCH_PROCESS_LOGS_ERROR',
  FETCH_PROCESS_LOGS_SUCCESS = '@@checklist/ListView/FETCH_PROCESS_LOGS_SUCCESS',

  ADD_CUSTOM_VIEW = '@@checklist/ListView/ADD_CUSTOM_VIEW',
  ADD_CUSTOM_VIEW_ERROR = '@@checklist/ListView/ADD_CUSTOM_VIEW_ERROR',
  ADD_CUSTOM_VIEW_SUCCESS = '@@checklist/ListView/ADD_CUSTOM_VIEW_SUCCESS',

  GET_CUSTOM_VIEWS = '@@checklist/ListView/GET_CUSTOM_VIEWS',
  GET_CUSTOM_VIEWS_ERROR = '@@checklist/ListView/GET_CUSTOM_VIEWS_ERROR',
  GET_CUSTOM_VIEWS_SUCCESS = '@@checklist/ListView/GET_CUSTOM_VIEWS_SUCCESS',

  SAVE_CUSTOM_VIEW = '@@checklist/ListView/SAVE_CUSTOM_VIEW',
  SAVE_CUSTOM_VIEW_ERROR = '@@checklist/ListView/SAVE_CUSTOM_VIEW_ERROR',
  SAVE_CUSTOM_VIEW_SUCCESS = '@@checklist/ListView/SAVE_CUSTOM_VIEW_SUCCESS',

  DELETE_CUSTOM_VIEW = '@@checklist/ListView/DELETE_CUSTOM_VIEW',
  DELETE_CUSTOM_VIEW_ERROR = '@@checklist/ListView/DELETE_CUSTOM_VIEW_ERROR',
  DELETE_CUSTOM_VIEW_SUCCESS = '@@checklist/ListView/DELETE_CUSTOM_VIEW_SUCCESS',
  EXPORT_CHECKLIST = '@@checklist/ListView/EXPORT_CHECKLIST',
}

export type ListViewActionType = ReturnType<
  | typeof fetchChecklists
  | typeof fetchChecklistsError
  | typeof fetchChecklistsOngoing
  | typeof fetchChecklistsSuccess
  | typeof updateList
  | typeof clearData
  | typeof fetchAutomations
  | typeof fetchAutomationsError
  | typeof fetchAutomationsSuccess
  | typeof fetchProcessLogs
  | typeof fetchProcessLogsError
  | typeof fetchProcessLogsSuccess
  | typeof addCustomView
  | typeof addCustomViewError
  | typeof addCustomViewSuccess
  | typeof getCustomViews
  | typeof getCustomViewsError
  | typeof getCustomViewsSuccess
  | typeof saveCustomView
  | typeof saveCustomViewError
  | typeof saveCustomViewSuccess
  | typeof deleteCustomViewError
  | typeof deleteCustomViewSuccess
  | typeof exportChecklist
>;
