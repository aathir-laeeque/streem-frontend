import { ActivitiesById } from '#JobComposer/ActivityList/types';
import { JobState } from '#JobComposer/composer.types';
import { TasksById } from '#JobComposer/TaskList/types';
import { actionSpreader } from '#store';
import { Job } from '#views/Jobs/types';

import { Stage } from '../checklist.types';
import { StageListAction } from './reducer.types';

type startPollActiveStageDataArgs = {
  jobId: Job['id'];
};

export interface fetchActiveStageDataRes {
  jobId: Job['id'];
  jobState: JobState;
  stage: Stage;
  tasksById: TasksById;
  activitiesById: ActivitiesById;
}

export const setActiveStage = (id: Stage['id'], bringIntoView = false) =>
  actionSpreader(StageListAction.SET_ACTIVE_STAGE, { id, bringIntoView });

export const startPollActiveStageData = ({
  jobId,
}: startPollActiveStageDataArgs) =>
  actionSpreader(StageListAction.START_POLL_ACTIVE_STAGE_DATA, { jobId });

export const stopPollActiveStageData = () =>
  actionSpreader(StageListAction.STOP_POLL_ACTIVE_STAGE_DATA);

export const fetchActiveStageDataSuccess = (data: fetchActiveStageDataRes) =>
  actionSpreader(StageListAction.FETCH_ACTIVE_STAGE_DATA_SUCCESS, {
    data,
  });
