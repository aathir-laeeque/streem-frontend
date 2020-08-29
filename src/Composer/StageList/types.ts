import { Stage } from '../checklist.types';
import { ComposerActionType } from '../types';
import { addNewStage, setActiveStage } from './actions';

export type ListById = Record<Stage['id'], Stage>;

// export type IdOrderMapping = Record<Stage['id'], Stage['orderTree']>;

export type StageListState = {
  activeStageId?: Stage['id'];
  // idOrderMapping: IdOrderMapping;
  list: Omit<Stage, 'tasks'>[];
  listById: ListById;
};

export enum StageListAction {
  SET_ACTIVE_STAGE = '@@composer/stage-list/SET_ACTIVE_STAGE',
  ADD_NEW_STAGE = '@@composer/stage-list/ADD_NEW_STAGE',
}

export type StageListActionType =
  | ReturnType<typeof setActiveStage | typeof addNewStage>
  | ComposerActionType;

export type StageCardProps = {
  isActive: boolean;
  stage: Omit<Stage, 'tasks'>;
};
