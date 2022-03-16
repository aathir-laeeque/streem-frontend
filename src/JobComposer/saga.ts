import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import {
  closeOverlayAction,
  openOverlayAction,
} from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  apiCompleteJob,
  apiGetAllUsersAssignedToJob,
  apiGetChecklist,
  apiGetSelectedJob,
  apiStartJob,
  apiTaskSignOff,
  apiValidatePassword,
} from '#utils/apiUrls';
import { LoginErrorCodes } from '#utils/constants';
import { request } from '#utils/request';
import { encrypt } from '#utils/stringUtils';
import { navigate } from '@reach/router';
import {
  all,
  call,
  fork,
  put,
  takeLatest,
  takeLeading,
} from 'redux-saga/effects';

import {
  completeJob,
  fetchData,
  fetchDataOngoing,
  fetchDataSuccess,
  getSignOffState,
  setSignOffError,
  signOffTasks,
  startJob,
  startJobSuccess,
} from './actions';
import { setActivityError } from './ActivityList/actions';
import { ActivityListSaga } from './ActivityList/saga';
import { ComposerAction } from './composer.reducer.types';
import { Entity } from './composer.types';
import { JobAuditLogsSaga } from './JobAuditLogs/saga';
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
      'PATCH',
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
    const { jobId, withException, values, details, isInboxView } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiCompleteJob(withException, jobId),
      { ...(withException ? { data: { ...values } } : {}) },
    );

    if (data) {
      if (withException) {
        yield put(closeOverlayAction(OverlayNames.COMPLETE_JOB_WITH_EXCEPTION));
      }

      if (isInboxView) {
        navigate('/inbox');
      } else {
        navigate('/jobs');
      }
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: `JobId ${details?.code} was successfully completed ${
            withException ? 'with exception' : ''
          }`,
        }),
      );
    } else {
      if (!withException) {
        const { tasksErrors, activitiesErrors, signOffErrors } =
          groupJobErrors(errors);

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

function* getSignOffStateSaga({ payload }: ReturnType<typeof getSignOffState>) {
  try {
    const { jobId, allowSignOff } = payload;

    const { data, errors } = yield call(
      request,
      'GET',
      apiGetAllUsersAssignedToJob(jobId),
    );

    if (data) {
      yield put(
        openOverlayAction({
          type: OverlayNames.SIGN_COMPLETED_TASKS,
          props: { data, jobId, allowSignOff },
        }),
      );
    } else {
      console.error('error from api :: ', errors);
    }
  } catch (error) {
    console.error('error came in getSignOffStateSaga :: ', error);
  }
}

function* signOffTaskSaga({ payload }: ReturnType<typeof signOffTasks>) {
  try {
    const { jobId, password } = payload;

    const { data: validateData, errors: validateErrors } = yield call(
      request,
      'PATCH',
      apiValidatePassword(),
      { data: { password: encrypt(password) } },
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
      if (validateErrors[0].code === LoginErrorCodes.INVALID_CREDENTIALS) {
        yield put(setSignOffError('Incorrect Password'));
      }
    }
  } catch (error) {
    console.error('error from signOffTasksSaga :', error);
  }
}

export function* ComposerSaga() {
  yield takeLatest(ComposerAction.FETCH_COMPOSER_DATA, fetchDataSaga);

  yield takeLeading(ComposerAction.COMPLETE_JOB, completeJobSaga);
  yield takeLeading(ComposerAction.START_JOB, startJobSaga);
  yield takeLatest(ComposerAction.GET_SIGN_OFF_STATE, getSignOffStateSaga);
  yield takeLeading(ComposerAction.SIGN_OFF_TASKS, signOffTaskSaga);

  yield all([
    // fork other sagas here
    fork(StageListSaga),
    fork(TaskListSaga),
    fork(ActivityListSaga),
    fork(JobAuditLogsSaga),
  ]);
}
