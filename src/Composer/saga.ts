import { RootState } from '#store';
import {
  apiCompleteJob,
  apiGetChecklist,
  apiGetSelectedJob,
  apiStartJob,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';

import {
  completeJob,
  fetchData,
  fetchDataOngoing,
  fetchDataSuccess,
  startJob,
  startJobSuccess,
} from './actions';
import { setActivityError } from './ActivityList/actions';
import { ActivityListSaga } from './ActivityList/saga';
import { ComposerAction } from './composer.reducer.types';
import { StageListSaga } from './StageList/saga';
import { setTaskError } from './TaskList/actions';
import { TaskListSaga } from './TaskList/saga';
import { Entity } from './composer.types';
import { groupJobErrors } from './utils';

function* fetchDataSaga({ payload }: ReturnType<typeof fetchData>) {
  try {
    const { id, entity } = payload;

    yield put(fetchDataOngoing());

    const { data, errors } = yield call(
      request,
      'GET',
      entity === Entity.CHECKLIST ? apiGetChecklist(id) : apiGetSelectedJob(id),
    );

    if (data) {
      yield put(fetchDataSuccess(data, entity));
    } else {
      // TODO: handle the api error when design comes
      console.error('error from fetch checklist/job api ==>> ', errors);
    }
  } catch (error: unknown) {
    console.error('error from fetchDataSaga in ComposerSaga :: ', error);
  }
}

function* startJobSaga({ payload }: ReturnType<typeof startJob>) {
  try {
    console.log('make api call to start the job here');
    console.log('payload for start job :: ', payload);
    const { jobId } = payload;

    const { data, errors } = yield call(
      request,
      'PUT',
      apiStartJob(jobId, 'start'),
    );

    if (data) {
      yield put(startJobSuccess());
    } else {
      console.error('handle errors on start job :: ', errors);
    }
  } catch (error) {
    console.error('error came in startJobSaga in ComposerSaga :: ', error);
  }
}

function* completeJobSaga({ payload }: ReturnType<typeof completeJob>) {
  try {
    const { entityId: jobId } = yield select(
      (state: RootState) => state.composer,
    );

    const { data, errors } = yield call(
      request,
      'PUT',
      apiCompleteJob(payload.withException, jobId),
    );

    if (data) {
      console.log('complete job success');
    } else {
      console.error('handle complete job errors here:: ', errors);

      const { tasksErrors, activitiesErrors } = groupJobErrors(errors);

      if (tasksErrors.length) {
        console.log('handle task level error here');

        yield all(
          tasksErrors.map((error) =>
            put(setTaskError('Activity Incomplete', error.id)),
          ),
        );
      }
      if (activitiesErrors.length) {
        console.log('handle activities level error here');
        yield all(
          activitiesErrors.map((error) =>
            put(setActivityError(error, error.id)),
          ),
        );
      }
    }

    console.log('data on complete job :: ', data);
  } catch (error) {
    console.error('error came in completeJobSaga in ComposerSaga :: ', error);
  }
}

export function* ComposerSaga() {
  yield takeLatest(ComposerAction.FETCH_COMPOSER_DATA, fetchDataSaga);

  yield takeLatest(ComposerAction.COMPLETE_JOB, completeJobSaga);
  yield takeLatest(ComposerAction.START_JOB, startJobSaga);

  yield all([
    // fork other sagas here
    fork(StageListSaga),
    fork(TaskListSaga),
    fork(ActivityListSaga),
  ]);
}
