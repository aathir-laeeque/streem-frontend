import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  apiBranchingRuleExecute,
  apiGetChecklist,
  apiGetSelectedJob as apiGetJob,
  apiValidatePrototype,
} from '#utils/apiUrls';
import { Error } from '#utils/globalTypes';
import { request } from '#utils/request';
import { all, call, fork, put, takeLatest, takeLeading } from 'redux-saga/effects';
import {
  executeBranchingRulesParameter,
  fetchComposerData,
  fetchComposerDataOngoing,
  fetchComposerDataSuccess,
  setChecklistValidationErrors,
  updateHiddenParameterIds,
  validatePrototype,
} from './actions';
import { setValidationError as setParameterValidationError } from './Activity/actions';
import { ParameterSaga } from './Activity/saga';
import { ChecklistAuditLogsSaga } from './ChecklistAuditLogs/saga';
import { ComposerAction } from './reducer.types';
import { ReviewerSaga } from './reviewer.saga';
import { setValidationError as setStageValidationError } from './Stages/actions';
import { StageListSaga } from './Stages/saga';
import { setValidationError as setTaskValidationError } from './Tasks/actions';
import { TaskListSaga } from './Tasks/saga';
import { ComposerEntity } from './types';
import { groupErrors } from './utils';

function* fetchComposerDataSaga({ payload }: ReturnType<typeof fetchComposerData>) {
  try {
    const { id, entity, setLoading } = payload;

    if (setLoading) {
      yield put(fetchComposerDataOngoing({ entity }));
    }

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

function* validatePrototypeSaga({ payload }: ReturnType<typeof validatePrototype>) {
  try {
    const { id } = payload;
    const { errors } = yield call(request, 'GET', apiValidatePrototype(id));

    if ((errors as Array<Error>)?.length) {
      const { stagesErrors, tasksErrors, parametersErrors, otherErrors, errorsWithEntity } =
        groupErrors(errors);
      if (stagesErrors.length) {
        yield all(stagesErrors.map((error) => put(setStageValidationError(error))));
      }

      if (tasksErrors.length) {
        yield all(tasksErrors.map((error) => put(setTaskValidationError(error))));
      }

      if (parametersErrors.length) {
        yield all(parametersErrors.map((error) => put(setParameterValidationError(error))));
      }

      if (errorsWithEntity.length) {
        yield put(setChecklistValidationErrors(errorsWithEntity));
      }

      if (otherErrors.length) {
        yield all(
          otherErrors.map((error) =>
            put(
              showNotification({
                type: NotificationType.ERROR,
                msg: error.message,
              }),
            ),
          ),
        );
      }
    } else {
      yield put(setChecklistValidationErrors([]));
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

function* executeBranchingRulesSaga({
  payload,
}: ReturnType<typeof executeBranchingRulesParameter>) {
  try {
    const { parameterValues, checklistId = undefined } = payload;
    const { data } = yield call(request, 'PATCH', apiBranchingRuleExecute(), {
      data: { parameterValues, checklistId },
    });
    yield put(updateHiddenParameterIds(data));
  } catch (error) {
    console.error('error from executeBranchingRules function in Composer Saga :: ', error);
  }
}

export function* ComposerSaga() {
  yield takeLeading(ComposerAction.FETCH_COMPOSER_DATA, fetchComposerDataSaga);
  yield takeLeading(ComposerAction.VALIDATE_PROTOTYPE, validatePrototypeSaga);
  yield takeLatest(ComposerAction.EXECUTE_LATEST_BRANCHING_RULES, executeBranchingRulesSaga);
  yield all([
    fork(StageListSaga),
    fork(TaskListSaga),
    fork(ParameterSaga),
    fork(ReviewerSaga),
    fork(ChecklistAuditLogsSaga),
  ]);
}
