import { RootState } from '#store';
import { all, fork, put, select, takeLatest } from 'redux-saga/effects';

import { StageListAction, StageListState } from '../StageList/types';
import { setActiveStage } from './../StageList/actions';
import { setTasks } from './actions';
import { setActiveTask } from './TaskView/actions';
import { TaskViewSaga } from './TaskView/saga';
import { TasksById } from './types';

function* setTasksSaga({ payload }: ReturnType<typeof setActiveStage>) {
  try {
    const { list }: StageListState = yield select(
      (state: RootState) => state.checklist.composer.stages,
    );

    const { tasks } = list[payload.stageId];

    yield put(
      setTasks(
        tasks.reduce<TasksById>((acc, el) => {
          acc[el.id] = el;
          return acc;
        }, {}),
      ),
    );
    yield put(setActiveTask(tasks[0].id));
  } catch (error) {
    console.error('error form setTasksSaga in StepListSaga :: ', error);
  }
}

export function* TaskListSaga() {
  yield takeLatest(StageListAction.SET_ACTIVE_STAGE, setTasksSaga);

  yield all([fork(TaskViewSaga)]);
}
