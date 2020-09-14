import { Stage } from '../checklist.types';
import { ComposerActionType } from '../composer.reducer.types';
import { setActiveStage } from './actions';
import { StagesById, StagesOrder } from './types';

export type StageListState = {
  activeStageId?: Stage['id'];

  bringIntoView: boolean;

  stagesById: StagesById;
  stagesOrder: StagesOrder;
};

export enum StageListAction {
  SET_ACTIVE_STAGE = '@@composer/stage-list/SET_ACTIVE_STAGE',
}

export type StageListActionType =
  | ReturnType<typeof setActiveStage>
  | ComposerActionType;
