import { request } from '#utils/request';
import { RootState } from '#store/types';
import { all, fork, takeLatest, select, call } from 'redux-saga/effects';

import { updateTask, completeTask } from './actions';
import { ActivityListSaga } from './ActivityList/saga';
import { TaskViewAction } from './types';
import { apiCompleteTask } from '#utils/apiUrls';

function* updateTaskSaga({ payload }: ReturnType<typeof updateTask>) {
  console.log('payload from updateTaskSaga :: ', payload);
}

function* completeTaskSaga({ payload }: ReturnType<typeof completeTask>) {
  console.log('taskId from completetaskSaga  :: ', payload.taskId);
  try {
    const { jobId } = yield select(
      (state: RootState) => state.checklist.composer,
    );

    console.log('jobId :: ', jobId);

    yield call(request, 'PUT', apiCompleteTask(payload.taskId), {
      params: { action: 'finish' },
      data: { jobId },
    });
  } catch (error) {}
}

export function* TaskViewSaga() {
  yield takeLatest(TaskViewAction.UPDATE_TASK, updateTaskSaga);
  yield takeLatest(TaskViewAction.COMPLETE_TASK, completeTaskSaga);

  yield all([fork(ActivityListSaga)]);
}
