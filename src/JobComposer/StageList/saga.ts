import { call, put, take, race, delay, select } from 'redux-saga/effects';
import { apiGetStageData } from '#utils/apiUrls';
import { RootState } from '#store';
import { request } from '#utils/request';
import {
  startPollActiveStageData,
  stopPollActiveStageData,
  fetchActiveStageDataSuccess,
  fetchActiveStageDataRes,
} from './actions';
import { StageListAction } from './reducer.types';
import {
  CompletedJobState,
  JOB_STAGE_POLLING_TIMEOUT,
} from '#JobComposer/composer.types';

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

      if (currentStatus in CompletedJobState) {
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

        console.log('tasksById', tasksById);
        console.log('activitiesById', activitiesById);

        yield put(
          fetchActiveStageDataSuccess({
            ...data,
            tasksById,
            activitiesById,
          } as fetchActiveStageDataRes),
        );

        if (data.jobState in CompletedJobState) {
          yield put(stopPollActiveStageData());
        }
      }

      yield delay(JOB_STAGE_POLLING_TIMEOUT);
    } catch (err) {
      console.error(
        'error from startPollActiveStageData in Stage Saga :: ',
        err,
      );
      yield put(stopPollActiveStageData());
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
