import { Stage } from '../checklist.types';
import { updateTaskExecutionStatus } from '../TaskList/actions';
import { ComposerActionType } from '../types';
import { setActiveStage } from './actions';

export type ListById = Record<Stage['id'], Stage>;

// export type IdOrderMapping = Record<Stage['id'], Stage['orderTree']>;

export type StageListState = {
  activeStageId?: Stage['id'];
  // idOrderMapping: IdOrderMapping;
  list: Stage[];
  listById: ListById;
};

export enum StageListAction {
  SET_ACTIVE_STAGE = '@@composer/stage-list/SET_ACTIVE_STAGE',
}

export type StageListActionType =
  | ReturnType<typeof setActiveStage>
  | ReturnType<typeof updateTaskExecutionStatus>
  | ComposerActionType;

export type StageCardProps = {
  isActive: boolean;
  stage: Stage;
};
