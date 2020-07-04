import { actionSpreader } from '#store';

import { StageListAction, Stage } from './types';

export const setStages = (stages: Stage[]) =>
  actionSpreader(StageListAction.SET_STAGES, { stages });

export const setActiveStage = (stageId: Stage['id']) =>
  actionSpreader(StageListAction.SET_ACTIVE_STAGE, { stageId });

export const updateStage = (stage: Pick<Stage, 'id' | 'name'>) =>
  actionSpreader(StageListAction.UPDATE_STAGE, { stage });
