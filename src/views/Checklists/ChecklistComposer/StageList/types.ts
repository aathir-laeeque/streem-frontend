import { Step } from '../StepsList/StepView/types';
import { setActiveStage, updateStageName } from './actions';

export interface Stage {
  id: number;
  name: string;
  code: string;
  orderTree: number;
  steps: Step[];
}

export enum StageListActions {
  SET_ACTIVE_STAGE = '@@stage_list/SET_ACTIVE_STAGE',
  UPDATE_STAGE_NAME = '@@stage_list/UPDATE_STAGE_NAME',
}

export type StageListActionType = ReturnType<
  typeof setActiveStage | typeof updateStageName
>;
