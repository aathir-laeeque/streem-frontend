import { showNotification } from '#components/Notification/actions';
import { NotificationType } from '#components/Notification/types';
import { MandatoryParameter, NonMandatoryParameter } from '#PrototypeComposer/checklist.types';
import { RootState } from '#store';
import {
  apiAddNewParameter,
  apiGetParameters,
  apiSingleParameter,
  apiUnmapParameter,
} from '#utils/apiUrls';
import { FilterOperators, ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, select, takeLatest, takeLeading } from 'redux-saga/effects';
import {
  addNewParameter,
  addNewParameterError,
  addNewParameterSuccess,
  deleteParameter,
  deleteParameterError,
  deleteParameterSuccess,
  fetchParameters,
  fetchParametersError,
  fetchParametersSuccess,
  toggleNewParameter,
  updateParameterApi,
  updateParameterError,
  updateStoreParameter,
} from './actions';
import { ParameterListActions } from './reducer.types';

function* updateParameterSaga({ payload }: ReturnType<typeof updateParameterApi>) {
  try {
    const { parameter } = payload;
    const { data, errors } = yield call(request, 'PATCH', apiSingleParameter(parameter.id), {
      data: { ...parameter },
    });

    if (data) {
      yield put(updateStoreParameter(data, parameter.id));
      yield put(toggleNewParameter());
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: [NonMandatoryParameter.INSTRUCTION, NonMandatoryParameter.MATERIAL].includes(
            parameter?.type,
          )
            ? 'Instruction Updated Successfully'
            : parameter.type === MandatoryParameter.CHECKLIST
            ? 'Subtask Updated Successfully'
            : 'Parameter Updated Successfully',
          detail: parameter.label,
        }),
      );
    }

    if (errors) {
      yield put(updateParameterError(errors));
    }
  } catch (error) {
    console.error('error came in the updateParameterSaga :: ', error);
  }
}

function* addNewParameterSaga({ payload }: ReturnType<typeof addNewParameter>) {
  try {
    const { checklistId, stageId, taskId, ...parameter } = payload;

    const { data, errors } = yield call(
      request,
      'POST',
      apiAddNewParameter({ checklistId, stageId, taskId }),
      { data: parameter },
    );

    if (data) {
      if (stageId && taskId) {
        yield put(addNewParameterSuccess({ parameter: data, stageId, taskId }));
      } else {
        const {
          parameters: {
            parameters: { pageable },
          },
        } = yield select((state: RootState) => state.prototypeComposer);
        yield put(
          fetchParameters(checklistId, {
            page: pageable.page,
            size: pageable.size,
            filters: {
              op: FilterOperators.AND,
              fields: [{ field: 'archived', op: FilterOperators.EQ, values: [false] }],
            },
            sort: 'id,desc',
          }),
        );
      }
      yield put(toggleNewParameter());
      yield put(
        showNotification({
          type: NotificationType.SUCCESS,
          msg: [NonMandatoryParameter.INSTRUCTION, NonMandatoryParameter.MATERIAL].includes(
            parameter?.type,
          )
            ? 'New Instruction Created'
            : parameter.type === MandatoryParameter.CHECKLIST
            ? 'New Subtask Created'
            : 'New Parameter Created',
          detail: parameter.label,
        }),
      );
    } else {
      yield put(addNewParameterError(errors));
    }
  } catch (error) {
    console.error('error came in addNewParameterSaga :: ', error);
  }
}

function* deleteParameterSaga({ payload }: ReturnType<typeof deleteParameter>) {
  try {
    const { data, errors } = yield call(request, 'PATCH', apiUnmapParameter(payload.parameterId));

    if (data) {
      yield put(deleteParameterSuccess(payload));
    } else {
      yield put(deleteParameterError(errors));
    }
  } catch (error) {
    console.error('error came in deleteParameterSaga :: ', error);
  }
}

function* fetchParametersSaga({ payload }: ReturnType<typeof fetchParameters>) {
  try {
    const { params, checklistId } = payload;
    const { data, pageable }: ResponseObj<any[]> = yield call(
      request,
      'GET',
      apiGetParameters(checklistId),
      {
        params,
      },
    );

    if (data) {
      yield put(fetchParametersSuccess({ data, pageable }));
    }
  } catch (error) {
    console.error('error from fetchObjectTypesSaga function in Ontology Saga :: ', error);
    yield put(fetchParametersError(error));
  }
}

export function* ParameterSaga() {
  yield takeLeading(ParameterListActions.ADD_NEW_PARAMETER, addNewParameterSaga);
  yield takeLatest(ParameterListActions.UPDATE_PARAMETER_API, updateParameterSaga);
  yield takeLeading(ParameterListActions.DELETE_PARAMETER, deleteParameterSaga);
  yield takeLatest(ParameterListActions.FETCH_PARAMETERS, fetchParametersSaga);
}
