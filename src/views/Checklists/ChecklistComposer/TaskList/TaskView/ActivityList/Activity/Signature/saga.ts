import { apiUploadFile } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, takeLatest, put } from 'redux-saga/effects';

import { SignatureAction, uploadFile } from './actions';
import { executeActivity } from '../actions';

function* uploadFileSaga({ payload }: ReturnType<typeof uploadFile>) {
  try {
    const { formData, activity } = payload;
    const { data } = yield call(request, 'POST', apiUploadFile(), {
      formData: formData,
    });
    const medias = [data];
    yield put(executeActivity({ ...activity, data: { medias } }));
  } catch (error) {
    console.error(
      'error came in executeActivitySaga from ActivitySaga => ',
      error,
    );
  }
}

export function* SignatureSaga() {
  yield takeLatest(SignatureAction.UPLOAD_FILE, uploadFileSaga);
}
