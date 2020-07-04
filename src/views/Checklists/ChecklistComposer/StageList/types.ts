import { Task } from '../TaskList/StepView/types';
import { ComposerActionType } from './../types';
import { setActiveStage, setStages, updateStage } from './actions';

export interface Stage {
  id: number;
  name: string;
  code: string;
  orderTree: number;
  tasks: Task[];
}

export type StageById = Record<Stage['id'], Stage>;

export interface StageListState {
  list: StageById;
  activeStageId?: Stage['id'];
}

export enum StageListAction {
  SET_STAGES = '@@checklist/composer/stage_list/SET_STAGES',
  SET_ACTIVE_STAGE = '@@checklist/composer/stage_list/SET_ACTIVE_STAGE',
  UPDATE_STAGE = '@@checklist/composer/stage_list/UPDATE_STAGE',
}

export type StageListActionType =
  | ReturnType<typeof setActiveStage | typeof updateStage | typeof setStages>
  | ComposerActionType;
