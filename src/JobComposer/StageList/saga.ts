import { JOB_STAGE_POLLING_TIMEOUT } from '#JobComposer/composer.types';
import { RootState } from '#store';
import { apiGetStageData } from '#utils/apiUrls';
import { request } from '#utils/request';
import { jobActions } from '#views/Job/jobStore';
import { parseJobDataByStage } from '#views/Job/utils';
import { CompletedJobStates } from '#views/Jobs/ListView/types';
import { call, delay, put, race, select, take } from 'redux-saga/effects';
import { startPollActiveStageData, stopPollActiveStageData } from './actions';
import { StageListAction } from './reducer.types';

const getCurrentStatus = (state: RootState) => state.composer.jobState;
const getActiveStageId = (state: RootState) => state.composer.stages.activeStageId;
const getUserId = (state: RootState) => state.auth.userId;

function* activeStagePollingSaga({ payload }: ReturnType<typeof startPollActiveStageData>) {
  const { jobId } = payload;
  while (true) {
    try {
      const currentStatus = getCurrentStatus(yield select());
      const activeStageId = getActiveStageId(yield select());

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
        const userId = (yield select(getUserId)) as string;

        const parsedStageData = parseJobDataByStage(activeStageId, data, timestamp, userId!);

        yield put(
          jobActions.getStagePollingSuccess({
            stageId: activeStageId,
            data: parsedStageData,
          }),
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
