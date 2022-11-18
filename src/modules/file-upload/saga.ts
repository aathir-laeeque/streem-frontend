import {
  executeParameter,
  fixParameter,
  updateExecutedParameter,
} from '#JobComposer/ActivityList/actions';
import { apiUploadFile } from '#utils/apiUrls';
import { request } from '#utils/request';
import { call, put, takeLatest } from 'redux-saga/effects';
import { uploadFile } from './action';
import { FileUploadAction } from './types';

function* uploadFileSaga({ payload }: ReturnType<typeof uploadFile>) {
  try {
    const { formData, parameter, isCorrectingError } = payload;

    const { data } = yield call(request, 'POST', apiUploadFile(), {
      formData: formData,
    });

    if (data) {
      if (parameter) {
        // execute parameter if in upload file action parameter is passed
        const medias = [data];
        yield put(
          updateExecutedParameter({
            ...parameter,
            response: {
              ...parameter.response,
              medias,
              audit: undefined,
              state: 'EXECUTED',
            },
          }),
        );
        if (isCorrectingError) {
          yield put(fixParameter({ ...parameter, data: { medias } }));
        } else {
          yield put(executeParameter({ ...parameter, data: { medias } }));
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
