import { actionSpreader } from '#store';

import { Stage } from '../checklist.types';
import { StageListAction } from './reducer.types';

export const setActiveStage = (id: Stage['id'], bringIntoView = false) =>
  actionSpreader(StageListAction.SET_ACTIVE_STAGE, { id, bringIntoView });
