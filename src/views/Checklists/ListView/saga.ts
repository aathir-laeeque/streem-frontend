import { openOverlayAction } from '#components/OverlayContainer/actions';
import { OverlayNames } from '#components/OverlayContainer/types';
import {
  apiArchiveChecklist,
  apiArchiveValidate,
  apiGetChecklists,
  apiUnarchiveChecklist,
} from '#utils/apiUrls';
import { ResponseObj } from '#utils/globalTypes';
import { request } from '#utils/request';
import { call, put, takeLatest, takeLeading } from 'redux-saga/effects';

import { Checklist } from '../types';
import {
  archiveChecklist,
  fetchChecklists,
  fetchChecklistsError,
  fetchChecklistsOngoing,
  fetchChecklistsSuccess,
  handlePublishedArchive,
  unarchiveChecklist,
  updateList,
} from './actions';
import { ListViewAction } from './types';
import { store } from '../../../App';

function* fetchChecklistsSaga({ payload }: ReturnType<typeof fetchChecklists>) {
  try {
    const { params, dispatchOngoing } = payload;
    if (params.page === 0 && dispatchOngoing) {
      yield put(fetchChecklistsOngoing());
    }

    const { data, pageable }: ResponseObj<Checklist> = yield call(
      request,
      'GET',
      apiGetChecklists(),
      { params },
    );

    yield put(fetchChecklistsSuccess({ data, pageable }));
  } catch (error) {
    console.error(
      'error from fetchChecklist function in ChecklistListViewSaga :: ',
      error,
    );
    yield put(fetchChecklistsError(error));
  }
}

function* archiveChecklistSaga({
  payload,
}: ReturnType<typeof archiveChecklist>) {
  try {
    const { id, showPopup } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiArchiveChecklist(id),
    );

    if (data) {
      yield put(updateList(id));
      if (showPopup) {
        yield put(
          openOverlayAction({
            type: OverlayNames.ARCHIVE_MODAL,
            props: { mode: 'archive' },
          }),
        );
      }
    } else {
      console.error('error from apiArchiveChecklist :: ', errors);
    }
  } catch (error) {
    console.error('error in archiveChecklist saga :: ', error);
  }
}

function* unarchiveChecklistSaga({
  payload,
}: ReturnType<typeof unarchiveChecklist>) {
  try {
    const { id, showPopup } = payload;

    const { data, errors } = yield call(
      request,
      'PATCH',
      apiUnarchiveChecklist(id),
    );

    if (data) {
      yield put(updateList(id));
      if (showPopup) {
        yield put(
          openOverlayAction({
            type: OverlayNames.ARCHIVE_MODAL,
            props: { mode: 'unarchive' },
          }),
        );
      }
    } else {
      console.error('error from apiArchiveChecklist :: ', errors);
    }
  } catch (error) {
    console.error('error in archiveChecklist saga :: ', error);
  }
}

function* handlePublishedArchiveSaga({
  payload,
}: ReturnType<typeof handlePublishedArchive>) {
  try {
    const { id } = payload;

    const { data } = yield call(request, 'GET', apiArchiveValidate(id));

    if (data) {
      yield put(
        openOverlayAction({
          type: OverlayNames.SIMPLE_CONFIRMATION_MODAL,
          props: {
            header: 'Archive Checklist',
            body: 'Are you sure you want to Archive this Checklist?',
            onPrimaryClick: () => {
              store.dispatch(archiveChecklist(id, true));
            },
          },
        }),
      );
    } else {
      yield put(
        openOverlayAction({
          type: OverlayNames.ARCHIVE_MODAL,
          props: { mode: 'cannotArchive' },
        }),
      );
    }
  } catch (error) {
    console.error('error came in handlePublishedArchiveSaga :: ', error);
  }
}

export function* ChecklistListViewSaga() {
  yield takeLeading(ListViewAction.FETCH_CHECKLISTS, fetchChecklistsSaga);
  yield takeLatest(
    ListViewAction.FETCH_CHECKLISTS_FOR_LISTVIEW,
    fetchChecklistsSaga,
  );
  yield takeLatest(ListViewAction.ARCHIVE, archiveChecklistSaga);
  yield takeLatest(ListViewAction.UNARCHIVE, unarchiveChecklistSaga);
  yield takeLatest(
    ListViewAction.HANDLE_PUBLISHED_ARCHIVE,
    handlePublishedArchiveSaga,
  );
}
