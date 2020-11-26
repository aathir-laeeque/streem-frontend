import { Pageable } from '#utils/globalTypes';
import { RouteComponentProps } from '@reach/router';

import { Checklist } from '../types';
import {
  clearData,
  fetchChecklists,
  fetchChecklistsError,
  fetchChecklistsOngoing,
  fetchChecklistsSuccess,
  updateList,
} from './actions';

export type ListViewProps = RouteComponentProps;
export interface ListViewState {
  readonly checklists: Checklist[];
  readonly pageable: Pageable;
  readonly loading: boolean;
  readonly error?: any;
}

export enum ListViewAction {
  CLEAR_DATA = '@@checklis/ListView/CLEAR_DATA',

  FETCH_CHECKLISTS = '@@checklist/ListView/FETCH_CHECKLISTS',
  FETCH_CHECKLISTS_ERROR = '@@checklist/ListView/FETCH_CHECKLISTS_ERROR',
  FETCH_CHECKLISTS_ONGOING = '@@checklist/ListView/FETCH_CHECKLISTS_ONGOING',
  FETCH_CHECKLISTS_SUCCESS = '@@checklist/ListView/FETCH_CHECKLISTS_SUCCESS',

  ARCHIVE = '@@checklist/ListView/ARCHIVE',
  UNARCHIVE = '@@checklist/ListView/UNARCHIVE',
  UPDATE_LIST = '@@checklist/ListView/UPDATE_LIST',
}

export type ListViewActionType = ReturnType<
  | typeof fetchChecklists
  | typeof fetchChecklistsError
  | typeof fetchChecklistsOngoing
  | typeof fetchChecklistsSuccess
  | typeof updateList
  | typeof clearData
>;
