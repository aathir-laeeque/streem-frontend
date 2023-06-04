import { JOB_STAGE_POLLING_TIMEOUT } from '#JobComposer/composer.types';
import { RootState } from '#store';
import { setRecentServerTimestamp } from '#store/extras/action';
import { apiGetStageData } from '#utils/apiUrls';
import { request } from '#utils/request';
import { CompletedJobStates } from '#views/Jobs/ListView/types';
import { keyBy } from 'lodash';
import { call, delay, put, race, select, take } from 'redux-saga/effects';
import {
  fetchActiveStageDataRes,
  fetchActiveStageDataSuccess,
  startPollActiveStageData,
  stopPollActiveStageData,
} from './actions';
import { StageListAction } from './reducer.types';

const getCurrentStatus = (state: RootState) => state.composer.jobState;
const getActiveStageId = (state: RootState) => state.composer.stages.activeStageId;
const getHiddenIds = (state: RootState) => state.composer.parameters.hiddenIds;
const getActiveTaskId = (state: RootState) => state.composer.tasks.activeTaskId;

function* activeStagePollingSaga({ payload }: ReturnType<typeof startPollActiveStageData>) {
  const { jobId } = payload;
  while (true) {
    try {
      const currentStatus = getCurrentStatus(yield select());
      const activeStageId = getActiveStageId(yield select());
      const hiddenIds = getHiddenIds(yield select());
      let activeTaskId = getActiveTaskId(yield select());

      if (currentStatus in CompletedJobStates) {
        yield put(stopPollActiveStageData());
      }

      if (activeStageId) {
        const { data, errors, timestamp } = yield call(
          request,
          'GET',
          apiGetStageData(jobId, activeStageId.toString()),
        );

        if (errors) {
          throw 'Could Not Fetch Active Stage Data';
        }

        const {
          stage: { tasks, id },
          stageReports: reports,
        } = data;
        let parametersById: any = {};
        let tasksOrderInStage: any = [];
        let parametersOrderInTaskInStage: any = {};
        let hiddenTasksLength = 0;

        const tasksById = tasks.reduce((acc, task) => {
          let hiddenParametersLength = 0;
          parametersOrderInTaskInStage[task.id] = [];
          parametersById = {
            ...parametersById,
            ...task.parameters.reduce((ac, parameter) => {
              parametersOrderInTaskInStage[task.id].push(parameter.id);
              if (parameter.response?.hidden || task.hidden) {
                hiddenParametersLength++;
                hiddenIds[parameter.id] = true;
              } else if (hiddenIds[parameter.id]) {
                delete hiddenIds[parameter.id];
              }
              return { ...ac, [parameter.id]: parameter };
            }, {}),
          };
          if (task.hidden || task?.parameters?.length === hiddenParametersLength) {
            hiddenTasksLength++;
            hiddenIds[task.id] = true;
          } else if (hiddenIds[task.id]) {
            delete hiddenIds[task.id];
          }
          if (hiddenIds[task.id] && task.id === activeTaskId) {
            activeTaskId = undefined;
          } else if (!activeTaskId) {
            activeTaskId = task.id;
          }
          tasksOrderInStage.push(task.id);
          return { ...acc, [task.id]: task };
        }, {});

        if (tasks?.length === hiddenTasksLength) {
          hiddenIds[id] = true;
        } else if (hiddenIds[id]) {
          delete hiddenIds[id];
        }

        const stageReports = keyBy(reports, 'stageId');
        yield put(setRecentServerTimestamp(timestamp));
        yield put(
          fetchActiveStageDataSuccess({
            ...data,
            tasksById,
            parametersById,
            stageReports,
            tasksOrderInStage,
            hiddenIds,
            activeTaskId,
            parametersOrderInTaskInStage,
          } as fetchActiveStageDataRes),
        );

        if (data.jobState in CompletedJobStates) {
          yield put(stopPollActiveStageData());
        }
      }

      yield delay(JOB_STAGE_POLLING_TIMEOUT);
    } catch (err) {
      console.error('error from startPollActiveStageData in Stage Saga :: ', err);
      yield delay(JOB_STAGE_POLLING_TIMEOUT);
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
