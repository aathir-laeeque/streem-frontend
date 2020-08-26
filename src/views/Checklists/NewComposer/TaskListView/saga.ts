import { RootState } from '#store';
import { all, fork, put, select, takeLatest } from 'redux-saga/effects';

import { setActiveStage } from '../StageListView/action';
import { StageListViewAction } from '../StageListView/types';
import { setTasks } from './actions';
import { ActivitySaga } from './TaskView/ActivityListView/Activity/saga';
import { Stage } from '../checklist.types';

// function* setTasksSaga({ payload }: ReturnType<typeof setActiveStage>) {
//   try {
//     const { stages } = yield select(
//       (state: RootState) => state.newComposer.checklist,
//     );

//     const activeStage = (stages as Array<Stage>).find(
//       (el) => el.id === payload.stageId,
//     );

//     yield put(
//       setTasks(
//         activeStage?.tasks ?? [],
//         activeStage?.name ?? '',
//         activeStage?.orderTree ?? 0,
//       ),
//     );
//   } catch (error) {
//     console.log('error from setTasksSaga :: ', error);
//   }
// }

export function* TaskListViewSaga() {
  // yield takeLatest(StageListViewAction.SET_ACTIVE_STAGE, setTasksSaga);

  yield all([
    // fork activity saga
    fork(ActivitySaga),
  ]);
}
