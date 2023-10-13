import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { closeOverlayAction, openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import { RootState } from '#store';
import { setRecentServerTimestamp } from '#store/extras/action';
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
import { Error } from '#utils/globalTypes';
import { request } from '#utils/request';
import { encrypt } from '#utils/stringUtils';
import { navigate } from '@reach/router';
import { all, call, fork, put, select, takeLatest, takeLeading } from 'redux-saga/effects';
import { setParameterError } from './ActivityList/actions';
import { ParameterListSaga } from './ActivityList/saga';
import { StageListSaga } from './StageList/saga';
import { setTaskError } from './TaskList/actions';
import { TaskListSaga } from './TaskList/saga';
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
  updateHiddenIds,
} from './actions';
import { ComposerAction } from './composer.reducer.types';
import { Entity, JobErrors, JobWithExceptionInCompleteTaskErrors } from './composer.types';
import { RefetchJobErrorType } from './modals/RefetchJobComposerData';
import { groupJobErrors } from './utils';

const getUserId = (state: RootState) => state.auth.userId;

function* fetchDataSaga({ payload }: ReturnType<typeof fetchData>) {
  try {
    const { id, entity, setActive } = payload;
    const userId = (yield select(getUserId)) as string;
    yield put(fetchDataOngoing());

    const { data, errors, timestamp } = yield call(
      request,
      'GET',
      entity === Entity.CHECKLIST ? apiGetChecklist(id) : apiGetSelectedJob(id),
    );

    if (data) {
      yield put(setRecentServerTimestamp(timestamp));
      yield put(fetchDataSuccess(data, entity, userId, setActive));
      yield put(updateHiddenIds());
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

    const { data, errors } = yield call(request, 'PATCH', apiStartJob(jobId));

    if (data) {
      yield put(startJobSuccess());
      yield put(closeOverlayAction(OverlayNames.START_JOB_MODAL));
    } else {
      console.error('handle errors on start job :: ', errors);
      const alreadyStartedError = (errors as Error[]).find((err) => err.code === 'E707');
      if (alreadyStartedError) {
        yield put(closeOverlayAction(OverlayNames.START_JOB_MODAL));
        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: alreadyStartedError.message,
              jobId,
              errorType: RefetchJobErrorType.JOB,
            },
          }),
        );
      }
    }
  } catch (error) {
    console.error('error came in startJobSaga in ComposerSaga :: ', error);
  }
}

function* completeJobSaga({ payload }: ReturnType<typeof completeJob>) {
  try {
    const { jobId, withException, values, details, isInboxView } = payload;

    const { data, errors } = yield call(request, 'PATCH', apiCompleteJob(withException, jobId), {
      ...(withException ? { data: { ...values } } : {}),
    });

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
      const jobErrors = (errors as Error[]).find((err) => err.code in JobErrors);

      if (jobErrors) {
        if (withException) {
          yield put(closeOverlayAction(OverlayNames.COMPLETE_JOB_WITH_EXCEPTION));
        }

        yield put(
          openOverlayAction({
            type: OverlayNames.REFETCH_JOB_COMPOSER_DATA,
            props: {
              modalTitle: jobErrors.message,
              jobId,
              errorType: RefetchJobErrorType.JOB,
            },
          }),
        );
      } else {
        if (!withException) {
          const { tasksErrors, parametersErrors, signOffErrors } = groupJobErrors(errors);

          if (tasksErrors.length) {
            console.log('handle task level error here');

            yield all(
              tasksErrors.map((error) => put(setTaskError('Parameter Incomplete', error.id))),
            );
          }
          if (parametersErrors.length) {
            console.log('handle parameters level error here');
            yield all(parametersErrors.map((error) => put(setParameterError(error, error.id))));
          }

          if (signOffErrors.length) {
            yield put(
              openOverlayAction({
                type: OverlayNames.SIGNNING_NOT_COMPLETE,
                props: {},
              }),
            );
          }
        } else {
          const showInCompleteTasksError = errors.some(
            (err: Error) => err.code in JobWithExceptionInCompleteTaskErrors,
          );
          if (showInCompleteTasksError) {
            yield put(closeOverlayAction(OverlayNames.COMPLETE_JOB_WITH_EXCEPTION));
            yield put(
              openOverlayAction({
                type: OverlayNames.JOB_COMPLETE_ALL_TASKS_ERROR,
              }),
            );
          }
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

    const { data, errors } = yield call(request, 'GET', apiGetAllUsersAssignedToJob(jobId));

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
    fork(ParameterListSaga),
  ]);
}
