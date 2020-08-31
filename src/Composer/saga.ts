import {
  apiGetChecklist,
  apiGetSelectedJob,
  apiStartJob,
  apiUnAssignUser,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, fork, put, takeLatest, select } from 'redux-saga/effects';

import {
  completeJob,
  fetchData,
  fetchDataOngoing,
  fetchDataSuccess,
  startJob,
  unAssignUsers,
} from './actions';
import { StageListSaga } from './StageList/saga';
import { TaskListSaga } from './TaskList/saga';
import { ComposerAction, Entity } from './types';

function* fetchDataSaga({ payload }: ReturnType<typeof fetchData>) {
  console.log('came to new composer data fetch saga with payload :: ', payload);
  try {
    const { id, entity } = payload;

    yield put(fetchDataOngoing());

    const { data } = yield call(
      request,
      'GET',
      entity === Entity.CHECKLIST ? apiGetChecklist(id) : apiGetSelectedJob(id),
    );

    yield put(fetchDataSuccess(data, entity));
  } catch (error) {
    console.log('error from fetchDataSaga in ComposerSaga :: ', error);
  }
}

function* startJobSaga({ payload }: ReturnType<typeof startJob>) {
  try {
    console.log('make api call to start the job here');
    console.log('payload for start job :: ', payload);
    const { jobId } = payload;

    const data = yield call(request, 'PUT', apiStartJob(jobId, 'start'));
    console.log('data  ::', data);
  } catch (error) {
    console.error('error came in startJobSaga in ComposerSaga :: ', error);
  }
}

function* completeJobSaga({ payload }: ReturnType<typeof completeJob>) {
  if (payload.withException) {
    console.log('make api call to complete the job with exception here');
  } else {
    console.log('make api call to complete the job here');
  }
}

function* publishChecklistSaga() {
  console.log('make api call to publish checklist here');
}

function* restartJobSaga() {
  console.log('make api call to restart the job here');
}

function* unAssignUsersFromJobSaga({
  payload,
}: ReturnType<typeof unAssignUsers>) {
  console.log('payload from unassignusersSaga :: ', payload);

  const { assignees } = yield select((state) => state.composer.data);

  console.log('assignees :: ', assignees);

  // assignees.map((el) => {
  yield call(
    request,
    'DELETE',
    apiUnAssignUser(payload.jobId, assignees[0].id),
  );
  yield call(
    request,
    'DELETE',
    apiUnAssignUser(payload.jobId, assignees[1].id),
  );
  yield call(
    request,
    'DELETE',
    apiUnAssignUser(payload.jobId, assignees[2].id),
  );
  // });
}

export function* ComposerSaga() {
  yield takeLatest(ComposerAction.FETCH_COMPOSER_DATA, fetchDataSaga);

  yield takeLatest(ComposerAction.COMPLETE_JOB, completeJobSaga);
  yield takeLatest(ComposerAction.COMPLETE_JOB_WITH_EXCEPTION, completeJobSaga);
  yield takeLatest(ComposerAction.START_JOB, startJobSaga);
  yield takeLatest(ComposerAction.RESTART_JOB, restartJobSaga);

  yield takeLatest(ComposerAction.PUBLISH_CHECKLIST, publishChecklistSaga);

  yield takeLatest(ComposerAction.UNASSIGN_USERS, unAssignUsersFromJobSaga);

  yield all([
    // fork other sagas here
    fork(StageListSaga),
    fork(TaskListSaga),
  ]);
}
