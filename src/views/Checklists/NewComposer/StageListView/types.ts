import { Stage } from '../checklist.types';
import { ComposerActionType } from '../composer.types';
import { setActiveStage } from './action';

export interface StageListViewState {
  activeStage: Stage | undefined;
  activeStageId: Stage['id'] | undefined;

  list: Stage[] | [];
  listById: Record<Stage['id'], Stage>;
}

export enum StageListViewAction {
  SET_ACTIVE_STAGE = '@@composer/stage_list/SET_ACTIVE_STAGE',
  UPDATE_STAGE = '@@composer/stage_list/UPDATE_STAGE',
}

export type StageListViewActionTypes =
  | ReturnType<typeof setActiveStage>
  | ComposerActionType;
