import { actionSpreader } from '#store';

import { Job } from '../views/Jobs/types';
import { Checklist } from './checklist.types';
import { Entity, FetchDataArgs } from './composer.types';
import { ComposerAction } from './composer.reducer.types';

export const fetchData = ({ id, entity }: FetchDataArgs) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA, { id, entity });

export const fetchDataError = (error: any) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ERROR, { error });

export const fetchDataOngoing = () =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ONGOING);

export const fetchDataSuccess = (data: Checklist | Job, entity: Entity) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_SUCCESS, { data, entity });

export const resetComposer = () =>
  actionSpreader(ComposerAction.RESET_COMPOSER);

export const startJob = (jobId: Job['id']) =>
  actionSpreader(ComposerAction.START_JOB, { jobId });

export const startJobSuccess = () =>
  actionSpreader(ComposerAction.START_JOB_SUCCESS);

export const completeJob = (withException = false) =>
  actionSpreader(ComposerAction.COMPLETE_JOB, { withException });

export const completeJobSuccess = (withException = false) =>
  actionSpreader(
    withException
      ? ComposerAction.COMPLETE_JOB_WITH_EXCEPTION_SUCCESS
      : ComposerAction.COMPLETE_JOB_SUCCESS,
  );
