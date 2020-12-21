import { Checklist } from '#PrototypeComposer/checklist.types';
import { actionSpreader } from '#store/helpers';

import { Author, FormValues, NewPrototypeActions } from './types';

export const addNewPrototype = (data: FormValues) =>
  actionSpreader(NewPrototypeActions.ADD_NEW_PROTOTYPE, { data });

export const addRevisionPrototype = (
  checklistId: Checklist['id'],
  code: Checklist['code'],
  name: Checklist['name'],
) =>
  actionSpreader(NewPrototypeActions.ADD_REVISION_PROTOTYPE, {
    checklistId,
    code,
    name,
  });

export const updatePrototype = (
  data: FormValues,
  id: Checklist['id'],
  originalAuthors: Author['id'][],
) =>
  actionSpreader(NewPrototypeActions.UPDATE_PROTOTYPE, {
    data,
    id,
    originalAuthors,
  });
