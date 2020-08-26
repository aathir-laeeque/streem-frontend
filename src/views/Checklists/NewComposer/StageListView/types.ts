import { Stage } from '../checklist.types';
import { ComposerActionType } from '../composer.types';
import { setActiveStage, updateStage } from './action';

export type StageListById = Record<Stage['id'], Stage>;

export interface StageListViewState {
  activeStageId: Stage['id'];
  list: StageListById;
  listOrder: Stage['id'][];
}

export enum StageListViewAction {
  SET_ACTIVE_STAGE = '@@composer/stage_list/SET_ACTIVE_STAGE',
  UPDATE_STAGE = '@@composer/stage_list/UPDATE_STAGE',
}

export type StageListViewActionTypes =
  | ReturnType<typeof setActiveStage | typeof updateStage>
  | ComposerActionType;
