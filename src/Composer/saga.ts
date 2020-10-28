import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import {
  closeOverlayAction,
  openOverlayAction,
} from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  apiAssignUsersToJob,
  apiCompleteJob,
  apiGetAssignedUsersForJob,
  apiGetChecklist,
  apiGetSelectedJob,
  apiStartJob,
  apiTaskSignOff,
  apiValidatePassword,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { navigate } from '@reach/router';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';

import {
  assignUsersToJob,
  assignUsersToJobError,
  assignUsersToJobSuccess,
  completeJob,
  fetchAssignedUsersForJob,
  fetchAssignedUsersForJobError,
  fetchAssignedUsersForJobSuccess,
  fetchData,
  fetchDataOngoing,
  fetchDataSuccess,
  getSignOffStatus,
  signOffTasks,
  startJob,
  startJobSuccess,
} from './actions';
import { setActivityError } from './ActivityList/actions';
import { ActivityListSaga } from './ActivityList/saga';
import { JobActivitySaga } from './JobActivity/saga';
import { ComposerAction } from './composer.reducer.types';
import { Entity } from './composer.types';
import { StageListSaga } from './StageList/saga';
import { setTaskError } from './TaskList/actions';
import { TaskListSaga } from './TaskList/saga';
import { groupJobErrors } from './utils';

function* fetchDataSaga({ payload }: ReturnType<typeof fetchData>) {
  try {
    const { id, entity, setActive } = payload;

    yield put(fetchDataOngoing());

    const { data, errors } = yield call(
      request,
      'GET',
      entity === Entity.CHECKLIST ? apiGetChecklist(id) : apiGetSelectedJob(id),
    );

    if (data) {
      yield put(fetchDataSuccess(data, entity, setActive));
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
    const { jobId, withException, values, details } = payload;

    const { data, errors } = yield call(
      request,
      'PUT',
      apiCompleteJob(withException, jobId),
      { ...(withException ? { data: { ...values } } : {}) },
    );

    if (data) {
      if (withException) {
        yield put(closeOverlayAction(OverlayNames.COMPLETE_JOB_WITH_EXCEPTION));
        navigate('/jobs');
        yield put(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: `JobId ${details?.code} was successfully completed with exception`,
          }),
        );
      } else {
        navigate('/jobs');
        yield put(
          showNotification({
            type: NotificationType.SUCCESS,
            msg: `JobId ${details?.code} was successfully completed`,
          }),
        );
      }
    } else {
      if (!withException) {
        const { tasksErrors, activitiesErrors, signOffErrors } = groupJobErrors(
          errors,
        );

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

        if (signOffErrors.length) {
          yield put(
            openOverlayAction({
              type: OverlayNames.SIGNNING_NOT_COMPLETE,
              props: {},
            }),
          );
        }
      }
    }
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

function* getSignOffStatusSaga({
  payload,
}: ReturnType<typeof getSignOffStatus>) {
  try {
    const { jobId, allowSignOff } = payload;

    const { data, errors } = yield call(
      request,
      'GET',
      apiGetAssignedUsersForJob(jobId),
    );

    if (data) {
      // if (allowSignOff) {
      yield put(
        openOverlayAction({
          type: OverlayNames.SIGN_COMPLETED_TASKS,
          props: { data, jobId, allowSignOff },
        }),
      );
      // } else {
      //   yield put(
      //     openOverlayAction({
      //       type: OverlayNames.SIGN_OFF_STATUS,
      //       props: { data },
      //     }),
      //   );
      // }
    } else {
      console.error('error from api :: ', errors);
    }
  } catch (error) {
    console.error('error came in getSignOffStatusSaga :: ', error);
  }
}

function* signOffTaskSaga({ payload }: ReturnType<typeof signOffTasks>) {
  try {
    const { jobId, password } = payload;

    const { data: validateData, errors: validateErrors } = yield call(
      request,
      'POST',
      apiValidatePassword(),
      { data: { password } },
    );

    if (validateData) {
      const { data, errors } = yield call(request, 'PATCH', apiTaskSignOff(), {
        data: { jobId, token: validateData.token },
      });

      if (data) {
        console.log('data from api :: ', data);
        yield put(closeOverlayAction(OverlayNames.SIGN_COMPLETED_TASKS));
      } else {
        console.error('error from api :: ', errors);
      }
    } else {
      console.error('error came in validte api :: ', validateErrors);
    }
  } catch (error) {
    console.error('error from signOffTasksSaga :', error);
  }
}

export function* ComposerSaga() {
  yield takeLatest(ComposerAction.FETCH_COMPOSER_DATA, fetchDataSaga);

  yield takeLatest(ComposerAction.COMPLETE_JOB, completeJobSaga);
  yield takeLatest(ComposerAction.START_JOB, startJobSaga);
  yield takeLatest(ComposerAction.GET_SIGN_OFF_STATUS, getSignOffStatusSaga);
  yield takeLatest(ComposerAction.SIGN_OFF_TASKS, signOffTaskSaga);

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
    fork(JobActivitySaga),
  ]);
}
