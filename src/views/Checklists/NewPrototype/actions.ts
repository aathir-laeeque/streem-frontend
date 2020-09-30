import { actionSpreader } from '#store/helpers';

import { FormOutput, NewPrototypeActions } from './types';

export const createNewPrototype = (data: FormOutput) =>
  actionSpreader(NewPrototypeActions.CREATE_NEW_PROTOTYPE, { data });
