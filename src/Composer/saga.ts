import { RootState } from '#store';
import {
  openOverlayAction,
  closeOverlayAction,
} from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  apiCompleteJob,
  apiGetChecklist,
  apiGetSelectedJob,
  apiStartJob,
  apiGetAssignedUsersForJob,
  apiAssignUsersToJob,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { all, call, fork, put, select, takeLatest } from 'redux-saga/effects';

import {
  completeJob,
  fetchData,
  fetchDataOngoing,
  fetchDataSuccess,
  startJob,
  startJobSuccess,
  fetchAssignedUsersForJob,
  fetchAssignedUsersForJobSuccess,
  fetchAssignedUsersForJobError,
  assignUsersToJob,
  assignUsersToJobSuccess,
  assignUsersToJobError,
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
      yield put(closeOverlayAction(OverlayNames.START_JOB_MODAL));
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

function* fetchAssignedUsersForJobSaga({
  payload,
}: ReturnType<typeof fetchAssignedUsersForJob>) {
  try {
    const { jobId } = payload;

    yield put(fetchDataOngoing());

    const { data, errors, error } = yield call(
      request,
      'GET',
      apiGetAssignedUsersForJob(jobId),
    );

    if (errors || error) {
      throw 'Could Not Assign Users To Job';
    }

    yield put(fetchAssignedUsersForJobSuccess(data));
  } catch (error: unknown) {
    console.error(
      'error from fetchAssignedUsersForJobSaga in ComposerSaga :: ',
      error,
    );
    yield put(fetchAssignedUsersForJobError(error));
  }
}

function* assignUsersToJobSaga({
  payload,
}: ReturnType<typeof assignUsersToJob>) {
  const { jobId, assignIds, unassignIds, notify } = payload;

  try {
    const { errors, error } = yield call(
      request,
      'PUT',
      apiAssignUsersToJob(),
      {
        data: {
          jobId,
          assignIds,
          unassignIds,
        },
      },
    );

    if (errors || error) {
      throw 'Could Not Assign Users to Job';
    }

    yield put(assignUsersToJobSuccess({ unassignIds }));
    yield put(
      openOverlayAction({
        type: OverlayNames.ASSIGNMENT_SUCCESS,
        props: { notify },
      }),
    );
  } catch (error) {
    console.error(
      'error from assignUsersToJobSaga function in Composer :: ',
      error,
    );
    yield put(assignUsersToJobError(error));
    yield put(
      showNotification({
        type: NotificationType.ERROR,
        msg: 'Could Not Assign Users',
      }),
    );
  }
}

export function* ComposerSaga() {
  yield takeLatest(ComposerAction.FETCH_COMPOSER_DATA, fetchDataSaga);

  yield takeLatest(ComposerAction.COMPLETE_JOB, completeJobSaga);
  yield takeLatest(ComposerAction.START_JOB, startJobSaga);

  yield takeLatest(
    ComposerAction.FETCH_ASSIGNED_USERS_FOR_JOB,
    fetchAssignedUsersForJobSaga,
  );
  yield takeLatest(ComposerAction.ASSIGN_USERS_TO_JOB, assignUsersToJobSaga);

  yield all([
    // fork other sagas here
    fork(StageListSaga),
    fork(TaskListSaga),
    fork(ActivityListSaga),
  ]);
}
