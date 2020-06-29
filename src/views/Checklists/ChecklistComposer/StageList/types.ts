import { setActiveStage, updateStage } from './actions';
import { Step } from '../StepsList/StepView/types';

export interface Stage {
  id: number;
  name: string;
  code: string;
  orderTree: number;
  steps: Step[];
}

export enum StageListAction {
  SET_ACTIVE_STAGE = '@@checklist/composer/stage_list/SET_ACTIVE_STAGE',
  UPDATE_STAGE = '@@checklist/composer/stage_list/UPDATE_STAGE',
}

export type StageListActionType = ReturnType<
  typeof setActiveStage | typeof updateStage
>;
