import {
  apiGetChecklist,
  apiGetSelectedJob as apiGetJob,
} from '#utils/apiUrls';
import { request } from '#utils/request';
import { all, call, fork, put, takeLeading } from 'redux-saga/effects';

import {
  fetchComposerData,
  fetchComposerDataOngoing,
  fetchComposerDataSuccess,
} from './actions';
import { ActivitySaga } from './Activity/saga';
import { ComposerAction } from './reducer.types';
import { StageListSaga } from './Stages/saga';
import { TaskListSaga } from './Tasks/saga';
import { ComposerEntity } from './types';

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

export function* ComposerSaga() {
  yield takeLeading(ComposerAction.FETCH_COMPOSER_DATA, fetchComposerDataSaga);

  yield all([fork(StageListSaga), fork(TaskListSaga), fork(ActivitySaga)]);
}
