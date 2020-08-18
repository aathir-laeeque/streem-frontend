import { StageListViewAction } from './types';
import { actionSpreader } from '#store';

import { Stage } from '../checklist.types';

export const setActiveStage = (stageId: Stage['id']) =>
  actionSpreader(StageListViewAction.SET_ACTIVE_STAGE, { stageId });
