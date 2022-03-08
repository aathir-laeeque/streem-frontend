import { actionSpreader } from '#store/helpers';
import { ResponseObj } from '#utils/globalTypes';
import { ChecklistActivityAction, ChecklistActivity } from './types';

export const fetchChecklistActivities = (payload: {
  checklistId: string;
  params: {
    size: number;
    filters: string;
    sort: string;
    page: number;
  };
}) => actionSpreader(ChecklistActivityAction.FETCH_CHECKLIST_ACTIVITY, payload);

export const fetchChecklistActivitiesOngoing = () =>
  actionSpreader(ChecklistActivityAction.FETCH_CHECKLIST_ACTIVITY_ONGOING);

export const fetchChecklistActivitiesSuccess = ({
  data,
  pageable,
}: Partial<ResponseObj<ChecklistActivity[]>>) =>
  actionSpreader(ChecklistActivityAction.FETCH_CHECKLIST_ACTIVITY_SUCCESS, {
    data,
    pageable,
  });

export const fetchChecklistActivitiesError = (error: any) =>
  actionSpreader(ChecklistActivityAction.FETCH_CHECKLIST_ACTIVITY_ERROR, {
    error,
  });
