import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  apiGetChecklist,
  apiGetSelectedJob as apiGetJob,
  apiValidatePrototype,
} from '#utils/apiUrls';
import { Error } from '#utils/globalTypes';
import { request } from '#utils/request';
import { all, call, fork, put, takeLeading } from 'redux-saga/effects';
import {
  fetchComposerData,
  fetchComposerDataOngoing,
  fetchComposerDataSuccess,
  validatePrototype,
} from './actions';
import { setValidationError as setActivityValidationError } from './Activity/actions';
import { ActivitySaga } from './Activity/saga';
import { ChecklistAuditLogsSaga } from './ChecklistAuditLogs/saga';
import { ComposerAction } from './reducer.types';
import { ReviewerSaga } from './reviewer.saga';
import { setValidationError as setStageValidationError } from './Stages/actions';
import { StageListSaga } from './Stages/saga';
import { setValidationError as setTaskValidationError } from './Tasks/actions';
import { TaskListSaga } from './Tasks/saga';
import { ComposerEntity } from './types';
import { groupErrors } from './utils';

function* fetchComposerDataSaga({
  payload,
}: ReturnType<typeof fetchComposerData>) {
  try {
    const { id, entity } = payload;

    yield put(fetchComposerDataOngoing({ entity }));

    if (entity === ComposerEntity.CHECKLIST) {
      const { data, errors } = yield call(request, 'GET', apiGetChecklist(id));

      if (data) {
        yield put(fetchComposerDataSuccess({ data, entity }));
      } else {
        console.info('Handle getChecklist API error');
        console.error(errors);
      }
    } else {
      const { data, errors } = yield call(request, 'GET', apiGetJob(id));

      if (data) {
        yield put(fetchComposerDataSuccess({ data, entity }));
      } else {
        console.info('Handle getSelectedJob API error');
        console.error(errors);
      }
    }
  } catch (error: unknown) {
    console.info('ERROR in fetchComposerDataSaga');
    console.error(error);
  }
}

function* validatePrototypeSaga({
  payload,
}: ReturnType<typeof validatePrototype>) {
  try {
    const { id } = payload;
    const { errors } = yield call(request, 'GET', apiValidatePrototype(id));

    if ((errors as Array<Error>)?.length) {
      const { stagesErrors, tasksErrors, activitiesErrors } =
        groupErrors(errors);
      if (stagesErrors.length) {
        yield all(
          stagesErrors.map((error) => put(setStageValidationError(error))),
        );
      }

      if (tasksErrors.length) {
        yield all(
          tasksErrors.map((error) => put(setTaskValidationError(error))),
        );
      }

      if (activitiesErrors.length) {
        yield all(
          activitiesErrors.map((error) =>
            put(setActivityValidationError(error)),
          ),
        );
      }
    } else {
      yield put(
        openOverlayAction({
          type: OverlayNames.CHECKLIST_REVIEWER_ASSIGNMENT,
          props: {
            checklistId: id,
          },
        }),
      );
    }
  } catch (error) {
    console.error('error came in apiValidatePrototype :: ', error);
  }
}

export function* ComposerSaga() {
  yield takeLeading(ComposerAction.FETCH_COMPOSER_DATA, fetchComposerDataSaga);
  yield takeLeading(ComposerAction.VALIDATE_PROTOTYPE, validatePrototypeSaga);
  yield all([
    fork(StageListSaga),
    fork(TaskListSaga),
    fork(ActivitySaga),
    fork(ReviewerSaga),
    fork(ChecklistAuditLogsSaga),
  ]);
}
