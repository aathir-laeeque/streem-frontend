import { ReOrderArgs } from './types';
import { actionSpreader } from '../../store/helpers';
import { StageListActions } from './reducer.types';
import { Stage } from '../checklist.types';

export const addNewStage = () => actionSpreader(StageListActions.ADD_NEW_STAGE);

export const addNewStageError = (error: any) =>
  actionSpreader(StageListActions.ADD_NEW_STAGE_ERROR, { error });

export const addNewStageSuccess = (stage: Stage) =>
  actionSpreader(StageListActions.ADD_NEW_STAGE_SUCCESS, { stage });

export const deleteStage = (stageId: Stage['id']) =>
  actionSpreader(StageListActions.DELETE_STAGE, { stageId });

export const deleteStageError = (error: any) =>
  actionSpreader(StageListActions.DELETE_STAGE_ERROR, { error });

export const deleteStageSuccess = (stageId: Stage['id']) =>
  actionSpreader(StageListActions.DELETE_STAGE_SUCCESS, { stageId });

export const duplicateStage = (stageId: Stage['id']) =>
  actionSpreader(StageListActions.DUPLICATE_STAGE, { stageId });

export const duplicateStageError = (error: any) =>
  actionSpreader(StageListActions.DUPLICATE_STAGE_ERROR, { error });

export const duplicateStageSuccess = (stageId: Stage['id']) =>
  actionSpreader(StageListActions.DUPLICATE_STAGE_SUCCESS, { stageId });

export const reOrderStage = ({ from, id, to }: ReOrderArgs) =>
  actionSpreader(StageListActions.REORDER_STAGE, { from, id, to });

export const reOrderStageError = (error: any) =>
  actionSpreader(StageListActions.REORDER_STAGE_ERROR, { error });

export const reOrderStageSuccess = ({ from, id, to }: ReOrderArgs) =>
  actionSpreader(StageListActions.REORDER_STAGE_SUCCESS, { from, id, to });

export const setActiveStage = (stageId: Stage['id']) =>
  actionSpreader(StageListActions.SET_ACTIVE_STAGE, { stageId });

export const updateStageName = (stage: Pick<Stage, 'name' | 'id'>) =>
  actionSpreader(StageListActions.UPDATE_STAGE_NAME, { stage });

export const updateStageNameError = (error: any) =>
  actionSpreader(StageListActions.UPDATE_STAGE_NAME_ERROR, { error });

export const updateStageNameSuccess = (updatedStage: Stage) =>
  actionSpreader(StageListActions.UPDATE_STAGE_NAME_SUCCESS, { updatedStage });
