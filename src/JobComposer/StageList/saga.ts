import { JOB_STAGE_POLLING_TIMEOUT } from '#JobComposer/composer.types';
import { RootState } from '#store';
import { apiGetStageData } from '#utils/apiUrls';
import { request } from '#utils/request';
import { CompletedJobStates } from '#views/Jobs/NewListView/types';
import { keyBy } from 'lodash';
import { call, delay, put, race, select, take } from 'redux-saga/effects';

import {
  fetchActiveStageDataRes,
  fetchActiveStageDataSuccess,
  startPollActiveStageData,
  stopPollActiveStageData,
} from './actions';
import { StageListAction } from './reducer.types';

const getCurrentStatus = (state: RootState) => state.composer.jobState;
const getActiveStageId = (state: RootState) =>
  state.composer.stages.activeStageId;

function* activeStagePollingSaga({
  payload,
}: ReturnType<typeof startPollActiveStageData>) {
  const { jobId } = payload;
  while (true) {
    try {
      const currentStatus = getCurrentStatus(yield select());
      const activeStageId = getActiveStageId(yield select());

      if (currentStatus in CompletedJobStates) {
        yield put(stopPollActiveStageData());
      }

      if (activeStageId) {
        const { data, errors } = yield call(
          request,
          'GET',
          apiGetStageData(jobId, activeStageId.toString()),
        );

        if (errors) {
          throw 'Could Not Fetch Active Stage Data';
        }

        const {
          stage: { tasks },
          stageReports: reports,
        } = data;
        let activitiesById: any = {};

        const tasksById = tasks.reduce((acc, task) => {
          activitiesById = {
            ...activitiesById,
            ...task.activities.reduce((ac, activity) => {
              return { ...ac, [activity.id]: activity };
            }, {}),
          };
          return { ...acc, [task.id]: task };
        }, {});

        const stageReports = keyBy(reports, 'stageId');

        yield put(
          fetchActiveStageDataSuccess({
            ...data,
            tasksById,
            activitiesById,
            stageReports,
          } as fetchActiveStageDataRes),
        );

        if (data.jobState in CompletedJobStates) {
          yield put(stopPollActiveStageData());
        }
      }

      yield delay(JOB_STAGE_POLLING_TIMEOUT);
    } catch (err) {
      console.error(
        'error from startPollActiveStageData in Stage Saga :: ',
        err,
      );
      yield delay(JOB_STAGE_POLLING_TIMEOUT);
    }
  }
}

export function* StageListSaga() {
  while (true) {
    const action = yield take(StageListAction.START_POLL_ACTIVE_STAGE_DATA);
    yield race([
      call(activeStagePollingSaga, action),
      take(StageListAction.STOP_POLL_ACTIVE_STAGE_DATA),
    ]);
  }
}
