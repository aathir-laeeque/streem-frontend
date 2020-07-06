import { RootState } from '#store';
import { all, fork, put, select, takeLatest } from 'redux-saga/effects';

import { StageListAction, StageListState } from '../StageList/types';
import { setActiveStage } from './../StageList/actions';
import { setTasks } from './actions';
import { setActiveTask } from './TaskView/actions';
import { ActivityById } from './TaskView/ActivityList/types';
import { setTaskActivities } from './TaskView/ActivityList/actions';
import { TaskViewSaga } from './TaskView/saga';
import { TasksById } from './types';

function* setTasksSaga({ payload }: ReturnType<typeof setActiveStage>) {
  try {
    const { list }: StageListState = yield select(
      (state: RootState) => state.checklist.composer.stages,
    );

    const { tasks, orderTree, name } = list[payload.stageId];

    let activitiesList: ActivityById = {};

    /**
     * * Grouping tasks by ID for easy state access and update
     */
    yield put(
      setTasks(
        tasks.reduce<TasksById>((acc, el) => {
          acc[el.id] = { ...el };

          // combining all the activities of a task and grouping by id
          activitiesList = {
            ...activitiesList,
            ...el.activities.reduce<ActivityById>((result, activity) => {
              result[activity.id] = activity;
              return result;
            }, {}),
          };

          return acc;
        }, {}),
        { orderTree, name },
      ),
    );

    /**
     * * Setting the first task id as active id by default
     */
    yield put(setActiveTask(tasks[0].id));

    /**
     * * Set the activities list to the reducer
     */
    yield put(
      setTaskActivities(activitiesList, Object.values(activitiesList)[0].id),
    );
  } catch (error) {
    console.error('error form setTasksSaga in StepListSaga :: ', error);
  }
}

export function* TaskListSaga() {
  yield takeLatest(StageListAction.SET_ACTIVE_STAGE, setTasksSaga);

  yield all([fork(TaskViewSaga)]);
}
