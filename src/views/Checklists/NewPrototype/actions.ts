import { Checklist } from '#Composer-new/checklist.types';
import { actionSpreader } from '#store/helpers';

import { FormValues, NewPrototypeActions } from './types';

export const addNewPrototype = (data: FormValues) =>
  actionSpreader(NewPrototypeActions.ADD_NEW_PROTOTYPE, { data });

export const updatePrototype = (data: FormValues, id: Checklist['id']) =>
  actionSpreader(NewPrototypeActions.UPDATE_PROTOTYPE, { data, id });
