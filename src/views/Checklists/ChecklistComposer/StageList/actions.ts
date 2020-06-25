import { actionSpreader } from '#store';

import { StageListActions } from './types';

export const setActiveStage = (index: number) =>
  actionSpreader(StageListActions.SET_ACTIVE_STAGE, { index });

export const updateStageName = ({
  name,
  index,
}: {
  name: string;
  index: number;
}) => actionSpreader(StageListActions.UPDATE_STAGE_NAME, { name, index });
