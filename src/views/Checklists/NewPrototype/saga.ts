import { apiCreateNewPrototype } from '#utils/apiUrls';
import { request } from '#utils/request';
import { navigate } from '@reach/router';
import { call, takeLeading } from 'redux-saga/effects';

import { apiUpdatePrototype } from '../../../utils/apiUrls';
import { addNewPrototype, updatePrototype } from './actions';
import { NewPrototypeActions } from './types';

function* addPrototypeSaga({ payload }: ReturnType<typeof addNewPrototype>) {
  try {
    const { data } = payload;

    const { data: response, errors } = yield call(
      request,
      'POST',
      apiCreateNewPrototype(),
      { data: { ...data, facilityId: 1 } },
    );

    if (response) {
      navigate(`/checklists/${response.id}`);
    } else {
      console.error('error from the create checklist api  :: ', errors);
    }
  } catch (error) {
    console.error(
      'error came in addPrototypeSaga in NewPrototypeSaga :: ',
      error,
    );
  }
}

function* updatePrototypeSaga({ payload }: ReturnType<typeof updatePrototype>) {
  try {
    const { data, id } = payload;
    console.log('id :: ', id);

    const { data: response, errors } = yield call(
      request,
      'PUT',
      apiUpdatePrototype(id),
      { data: { ...data, facilityId: 1 } },
    );

    if (response) {
      navigate(`/checklists/${response.id}`);
    } else {
      console.error('error from the create checklist api  :: ', errors);
    }
  } catch (error) {
    console.error(
      'error came in addPrototypeSaga in NewPrototypeSaga :: ',
      error,
    );
  }
}

export function* NewPrototypeSaga() {
  yield takeLeading(NewPrototypeActions.ADD_NEW_PROTOTYPE, addPrototypeSaga);
  yield takeLeading(NewPrototypeActions.UPDATE_PROTOTYPE, updatePrototypeSaga);
}
