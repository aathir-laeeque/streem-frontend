import { ActivitiesById } from '#JobComposer/ActivityList/types';
import { actionSpreader } from '#store';
import { Job, JobStateType } from '#views/Jobs/ListView/types';
import { Stage } from '../checklist.types';
import { TasksById } from '../TaskList/types';
import { StageListAction } from './reducer.types';
import { StageReports } from './types';

type startPollActiveStageDataType = {
  jobId: Job['id'];
};

export interface fetchActiveStageDataRes {
  jobId: Job['id'];
  jobState: JobStateType;
  stage: Stage;
  tasksById: TasksById;
  activitiesById: ActivitiesById;
  stageReports: StageReports;
}

export const setActiveStage = (id: Stage['id'], bringIntoView = false) =>
  actionSpreader(StageListAction.SET_ACTIVE_STAGE, { id, bringIntoView });

export const startPollActiveStageData = ({ jobId }: startPollActiveStageDataType) =>
  actionSpreader(StageListAction.START_POLL_ACTIVE_STAGE_DATA, { jobId });

export const stopPollActiveStageData = () =>
  actionSpreader(StageListAction.STOP_POLL_ACTIVE_STAGE_DATA);

export const fetchActiveStageDataSuccess = (data: fetchActiveStageDataRes) =>
  actionSpreader(StageListAction.FETCH_ACTIVE_STAGE_DATA_SUCCESS, {
    data,
  });
