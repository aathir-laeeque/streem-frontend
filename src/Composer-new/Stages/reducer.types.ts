import { Stage } from '../checklist.types';
import { ComposerActionType } from '../reducer.types';
import { updateStageNameError, updateStageNameSuccess } from './actions';
import {
  addNewStageError,
  addNewStageSuccess,
  deleteStageError,
  deleteStageSuccess,
  duplicateStageError,
  duplicateStageSuccess,
  reOrderStageError,
  reOrderStageSuccess,
  setActiveStage,
} from './actions';

export type StagesById = Record<string, Stage>;

export type StageListState = {
  readonly activeStageId?: Stage['id'];
  readonly error?: any;
  readonly listOrder: Stage['id'][];
  readonly listById: StagesById;
};

export enum StageListActions {
  ADD_NEW_STAGE = '@@composer/prototype/stage-list/ADD_NEW_STAGE',
  ADD_NEW_STAGE_ERROR = '@@composer/prototype/stage-list/ADD_NEW_STAGE_ERROR',
  ADD_NEW_STAGE_SUCCESS = '@@composer/prototype/stage-list/ADD_NEW_STAGE_SUCCESS',

  DELETE_STAGE = '@@composer/prototype/stage-list/DELETE_STAGE',
  DELETE_STAGE_ERROR = '@@composer/prototype/stage-list/DELETE_STAGE_ERROR',
  DELETE_STAGE_SUCCESS = '@@composer/prototype/stage-list/DELETE_STAGE_SUCCESS',

  DUPLICATE_STAGE = '@@composer/prototype/stage-list/DUPLICATE_STAGE',
  DUPLICATE_STAGE_ERROR = '@@composer/prototype/stage-list/DUPLICATE_STAGE_ERROR',
  DUPLICATE_STAGE_SUCCESS = '@@composer/prototype/stage-list/DUPLICATE_STAGE_SUCCESS',

  REORDER_STAGE = '@@composer/prototype/stage-list/REORDER_STAGE',
  REORDER_STAGE_ERROR = '@@composer/prototype/stage-list/REORDER_STAGE_ERROR',
  REORDER_STAGE_SUCCESS = '@@composer/prototype/stage-list/REORDER_STAGE_SUCCESS',

  SET_ACTIVE_STAGE = '@@composer/prototype/stage-list/SET_ACTIVE_STAGE',

  UPDATE_STAGE_NAME = '@@composer/prototype/stage-list/UPDATE_STAGE_NAME',
  UPDATE_STAGE_NAME_ERROR = '@@composer/prototype/stage-list/UPDATE_STAGE_NAME_ERROR',
  UPDATE_STAGE_NAME_SUCCESS = '@@composer/prototype/stage-list/UPDATE_STAGE_NAME_SUCCESS',
}

export type StageListActionType =
  | ReturnType<
      | typeof addNewStageError
      | typeof addNewStageSuccess
      | typeof deleteStageError
      | typeof deleteStageSuccess
      | typeof duplicateStageError
      | typeof duplicateStageSuccess
      | typeof reOrderStageError
      | typeof reOrderStageSuccess
      | typeof setActiveStage
      | typeof updateStageNameError
      | typeof updateStageNameSuccess
    >
  | ComposerActionType;
