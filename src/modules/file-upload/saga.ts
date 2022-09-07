import {
  executeActivity,
  fixActivity,
  updateExecutedActivity,
} from '#JobComposer/ActivityList/actions';
import { apiUploadFile } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, takeLatest } from 'redux-saga/effects';
import { uploadFile } from './action';
import { FileUploadAction } from './types';

function* uploadFileSaga({ payload }: ReturnType<typeof uploadFile>) {
  try {
    const { formData, activity, isCorrectingError } = payload;

    const { data } = yield call(request, 'POST', apiUploadFile(), {
      formData: formData,
    });

    if (data) {
      if (activity) {
        // execute activtiy if in upload file action activity is passed
        const medias = [data];
        yield put(
          updateExecutedActivity({
            ...activity,
            response: {
              ...activity.response,
              medias,
              audit: undefined,
              state: 'EXECUTED',
            },
          }),
        );
        if (isCorrectingError) {
          yield put(fixActivity({ ...activity, data: { medias } }));
        } else {
          yield put(executeActivity({ ...activity, data: { medias } }));
        }
      }
    } else {
      console.error('api call is success but gopt some error from BE for some reason');
    }
  } catch (error) {
    console.error('error came in file upload saga :: ', error);
  }
}

export function* FileUploadSaga() {
  yield takeLatest(FileUploadAction.UPLOAD_FILE, uploadFileSaga);
}
