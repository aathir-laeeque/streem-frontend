import { takeLatest, call, put } from 'redux-saga/effects';
import { apiUploadFile } from '#utils/apiUrls';
import { request } from '#utils/request';
import { FileUploadAction } from './types';
import { uploadFile } from './action';

import { executeActivity } from '#Composer/ActivityList/actions';

function* uploadFileSaga({ payload }: ReturnType<typeof uploadFile>) {
  try {
    const { formData, activity } = payload;

    console.log('formData from fileUpload saga :: ', formData);
    console.log('actiovity from fileUpload :: ', activity);

    const { data } = yield call(request, 'POST', apiUploadFile(), {
      formData: formData,
    });

    if (data) {
      if (activity) {
        // execute activtiy if in upload file action activity is passed
        const medias = [data];

        yield put(executeActivity({ ...activity, data: { medias } }));
      }
    } else {
      console.error(
        'api call is success but gopt some error from BE for some reason',
      );
    }
  } catch (error) {
    console.error('error came in file upload saga :: ', error);
  }
}

export function* FileUploadSaga() {
  yield takeLatest(FileUploadAction.UPLOAD_FILE, uploadFileSaga);
}
