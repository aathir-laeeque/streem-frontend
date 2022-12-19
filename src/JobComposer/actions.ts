import { actionSpreader } from '#store';
import { Job } from '#views/Jobs/ListView/types';

import { ComposerAction } from './composer.reducer.types';
import { Entity, FetchDataType } from './composer.types';
import { ExceptionValues } from './modals/CompleteJobWithException';

export const fetchData = ({ id, entity, setActive = false }: FetchDataType) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA, { id, entity, setActive });

export const fetchDataError = (error: any) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ERROR, { error });

export const fetchDataOngoing = () => actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_ONGOING);

// TODO: look into this any data type
export const fetchDataSuccess = (data: any, entity: Entity, setActive = false) =>
  actionSpreader(ComposerAction.FETCH_COMPOSER_DATA_SUCCESS, {
    data,
    entity,
    setActive,
  });

export const resetComposer = () => actionSpreader(ComposerAction.RESET_COMPOSER);

export const startJob = (jobId: Job['id']) => actionSpreader(ComposerAction.START_JOB, { jobId });

export const startJobSuccess = () => actionSpreader(ComposerAction.START_JOB_SUCCESS);

type CompleteJobType = {
  jobId: Job['id'];
  withException?: boolean;
  values?: ExceptionValues;
  details?: {
    code: Job['code'];
    name?: Job['checklist']['name'];
  };
  isInboxView: boolean;
};

export const completeJob = ({
  jobId,
  withException = false,
  values,
  details,
  isInboxView,
}: CompleteJobType) =>
  actionSpreader(ComposerAction.COMPLETE_JOB, {
    jobId,
    withException,
    values,
    details,
    isInboxView,
  });

type GetSignOffStateType = {
  jobId: Job['id'];
  allowSignOff?: boolean;
};

export const getSignOffState = ({ jobId, allowSignOff = false }: GetSignOffStateType) =>
  actionSpreader(ComposerAction.GET_SIGN_OFF_STATE, { jobId, allowSignOff });

type signOffTasksType = {
  jobId: Job['id'];
  password: string;
};

export const signOffTasks = ({ jobId, password }: signOffTasksType) =>
  actionSpreader(ComposerAction.SIGN_OFF_TASKS, { jobId, password });

export const setSignOffError = (error: string) =>
  actionSpreader(ComposerAction.SIGN_OFF_TASKS_ERROR, { error });

export const resetSignOffTaskError = () =>
  actionSpreader(ComposerAction.SIGN_OFF_TASKS_ERROR_RESET);

export const updateHiddenIds = () => actionSpreader(ComposerAction.UPDATE_HIDDEN_IDS);
