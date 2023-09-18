import { JOB_STAGE_POLLING_TIMEOUT } from '#JobComposer/composer.types';
import { RootState } from '#store';
import { apiGetStageData } from '#utils/apiUrls';
import { request } from '#utils/request';
import { CompletedJobStates } from '#views/Jobs/ListView/types';
import { call, delay, put, race, select, take } from 'redux-saga/effects';
import { jobActions } from './jobStore';
import { parseJobData, parseJobDataByStage } from './utils';
export const a = 10;

const getCurrentStatus = (state: RootState) => state.composer.jobState;
const getActiveStageId = (state: RootState) => state.composer.stages.activeStageId;
const getUserId = (state: RootState) => state.auth.userId;

function* activeStagePollingSaga({
  payload,
}: ReturnType<typeof jobActions.startPollActiveStageData>) {
  const { jobId } = payload;
  console.log('zero check saga state', jobId);
  while (true) {
    try {
      const currentStatus = getCurrentStatus(yield select());
      const activeStageId = getActiveStageId(yield select());

      if (currentStatus in CompletedJobStates) {
        yield put(jobActions.stopPollActiveStageData());
      }

      console.log('zero check two', activeStageId, currentStatus);

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

        // const parsedStageData = parseJobDataByStage(activeStageId, data, timestamp, userId!);

        // yield put(
        //   jobActions.getStagePollingSuccess({
        //     stageId: activeStageId,
        //     data: parsedStageData,
        //   }),
        // );
        const parsedJobData = parseJobData(data, userId!);

        // yield put(
        //   jobActions.getJobSuccess({
        //     data: parsedJobData,
        //   }),
        // );

        if (data.jobState in CompletedJobStates) {
          yield put(jobActions.stopPollActiveStageData());
        }
      }

      yield delay(JOB_STAGE_POLLING_TIMEOUT);
    } catch (err) {
      console.error('error from startPollActiveStageData in Job Saga :: ', err);
      yield delay(JOB_STAGE_POLLING_TIMEOUT);
    }
  }
}

export function* StagePollingSaga() {
  while (true) {
    const action = yield take(jobActions.startPollActiveStageData);
    // console.log('zero check saga polling', action);
    yield race([call(activeStagePollingSaga, action), take(jobActions.stopPollActiveStageData)]);
  }
}
