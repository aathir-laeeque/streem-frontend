import { apiCreateNewPrototype, apiUpdatePrototype } from '#utils/apiUrls';
import { request } from '#utils/request';
import { navigate } from '@reach/router';
import { pick } from 'lodash';
import { call, takeLeading } from 'redux-saga/effects';

import { addNewPrototype, updatePrototype } from './actions';
import { Author, FormMode, FormValues, NewPrototypeActions } from './types';

type transformFormDataArgs = {
  data: FormValues;
  mode: FormMode;
  originalAuthors?: Author['id'][];
};

const transformFormData = ({
  data,
  mode,
  originalAuthors,
}: transformFormDataArgs) => {
  const addAuthorIds: Author['id'][] = [],
    removeAuthorIds: Author['id'][] = [];

  data.authors.forEach((authorId) => {
    if (!originalAuthors?.includes(authorId)) {
      addAuthorIds.push(authorId);
    }
  });

  originalAuthors?.forEach((authorId) => {
    if (!data.authors.includes(authorId)) {
      removeAuthorIds.push(authorId);
    }
  });

  return {
    name: data.name,
    properties: data.properties.map((property) => ({
      ...pick(property, ['id', 'name', 'value']),
    })),

    ...(mode === FormMode.ADD
      ? { authors: data.authors.filter((authorId) => authorId !== '0') }
      : {
          addAuthorIds: addAuthorIds.filter((authorId) => authorId !== '0'),
          removeAuthorIds: removeAuthorIds,
        }),
  };
};

function* addPrototypeSaga({ payload }: ReturnType<typeof addNewPrototype>) {
  try {
    const { data } = payload;

    const { data: response, errors } = yield call(
      request,
      'POST',
      apiCreateNewPrototype(),
      {
        data: {
          ...transformFormData({ data, mode: FormMode.ADD }),
          facilityId: 1,
        },
      },
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
    const { data, id, originalAuthors } = payload;

    const { data: response, errors } = yield call(
      request,
      'PUT',
      apiUpdatePrototype(id),
      {
        data: {
          ...transformFormData({ data, originalAuthors, mode: FormMode.EDIT }),
          facilityId: 1,
        },
      },
    );

    if (response) {
      navigate(`/checklists/${id}`);
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