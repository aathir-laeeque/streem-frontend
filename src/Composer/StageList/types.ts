import { Stage } from '../checklist.types';
import { ComposerActionType } from '../composer.reducer.types';
import { setActiveStage } from './actions';

// removes tasks from stages
export type StagesById = Record<Stage['id'], Stage>;
export type StagesOrder = Stage['id'][];

export type StageListState = {
  activeStageId?: Stage['id'];

  stagesById: StagesById;
  stagesOrder: StagesOrder;
};

export enum StageListAction {
  SET_ACTIVE_STAGE = '@@composer/stage-list/SET_ACTIVE_STAGE',
}

export type StageListActionType =
  | ReturnType<typeof setActiveStage>
  | ComposerActionType;

export type StageCardProps = {
  isActive: boolean;
  stage: Stage;
};

export enum StageErrors {
  E301 = 'STAGE_INCOMPLETE',
}
