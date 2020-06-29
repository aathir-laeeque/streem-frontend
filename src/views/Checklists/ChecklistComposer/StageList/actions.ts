import { actionSpreader } from '#store';

import { StageListAction, Stage } from './types';

export const setActiveStage = (index: number) =>
  actionSpreader(StageListAction.SET_ACTIVE_STAGE, { index });

export const updateStage = ({
  index,
  stage,
}: {
  index: number;
  stage: Partial<Stage>;
}) => actionSpreader(StageListAction.UPDATE_STAGE, { index, stage });
