import { actionSpreader } from '#store';

import { Stage } from '../checklist.types';
import { StageListAction } from './types';

export const setActiveStage = (id: Stage['id']) =>
  actionSpreader(StageListAction.SET_ACTIVE_STAGE, { id });

export const addNewStage = (stage: Omit<Stage, 'tasks'>) =>
  actionSpreader(StageListAction.ADD_NEW_STAGE, { stage });
