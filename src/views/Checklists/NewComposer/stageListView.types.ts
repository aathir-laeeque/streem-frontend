import { Stage } from './checklist.types';
import { ComposerActionType } from './composer.types';
import { setActiveStage } from './stageListView.action';

export interface StageListViewState {
  list: Stage[] | [];
  activeStageId: Stage['id'] | undefined;
}

export enum StageListViewAction {
  SET_ACTIVE_STAGE = '@@composer/stage_list/SET_ACTIVE_STAGE',
  UPDATE_STAGE = '@@composer/stage_list/UPDATE_STAGE',
}

export type StageListViewActionTypes =
  | ReturnType<typeof setActiveStage>
  | ComposerActionType;
