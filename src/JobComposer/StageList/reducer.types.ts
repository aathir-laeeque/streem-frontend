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
  SET_ACTIVE_STAGE = '@@jobComposer/stage-list/SET_ACTIVE_STAGE',
  START_POLL_ACTIVE_STAGE_DATA = '@@jobComposer/stage-action/START_POLL_ACTIVE_STAGE_DATA',
  STOP_POLL_ACTIVE_STAGE_DATA = '@@jobComposer/stage-action/STOP_POLL_ACTIVE_STAGE_DATA',
  FETCH_ACTIVE_STAGE_DATA_SUCCESS = '@@jobComposer/stage-action/FETCH_ACTIVE_STAGE_DATA_SUCCESS',
}

export type StageListActionType =
  | ReturnType<typeof setActiveStage>
  | ComposerActionType;
