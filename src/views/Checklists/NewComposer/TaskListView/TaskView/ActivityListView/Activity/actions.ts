import { actionSpreader } from '#store';
import { omit } from 'lodash';

import { ActivityActions, ExecuteActivityArguments } from './types';

export const executeActivity = (activity: ExecuteActivityArguments) =>
  actionSpreader(ActivityActions.EXECUTE, {
    activity: { ...omit(activity, ['response', 'code', 'orderTree']) },
  });
