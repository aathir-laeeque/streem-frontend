import { Pageable } from '#utils/globalTypes';
import { Job } from '#views/Jobs/types';
import { RouteComponentProps } from '@reach/router';

import {
  fetchInbox,
  fetchInboxError,
  fetchInboxOngoing,
  fetchInboxSuccess,
  setSelectedStatus,
} from './actions';

type TabContentProps = Record<string, any>;
export type ListViewProps = RouteComponentProps;
export type TabViewProps = RouteComponentProps<TabContentProps>;

export type Inbox = Record<
  string,
  {
    list: Job[] | [];
    pageable: Pageable;
  }
>;
export interface ListViewState {
  readonly jobs: Inbox;
  readonly loading: boolean;
  readonly error: any;
  readonly selectedStatus: string;
}

export enum InboxStatus {
  MYINBOX = 'My Inbox',
}

export enum ListViewAction {
  FETCH_INBOX = '@@inbox/ListView/FETCH_INBOX',
  FETCH_INBOX_ERROR = '@@inbox/ListView/FETCH_INBOX_ERROR',
  FETCH_INBOX_ONGOING = '@@inbox/ListView/FETCH_INBOX_ONGOING',
  FETCH_INBOX_SUCCESS = '@@inbox/ListView/FETCH_INBOX_SUCCESS',
  SET_SELECTED_STATUS = '@@inbox/ListView/SET_SELECTED_STATUS',
}

export type ListViewActionType = ReturnType<
  | typeof fetchInbox
  | typeof fetchInboxError
  | typeof fetchInboxOngoing
  | typeof fetchInboxSuccess
  | typeof setSelectedStatus
>;