import { Stage } from '../checklist.types';
import { setActiveStage } from './actions';

export enum StageListAction {
  SET_ACTIVE_STAGE = '@@composer/stage-list/SET_ACTIVE_STAGE',
}

export type StageListActionType = ReturnType<typeof setActiveStage>;

export type StageCardProps = {
  isActive: boolean;
  stage: Stage;
};

export enum StageErrors {
  E301 = 'STAGE_INCOMPLETE',
}
