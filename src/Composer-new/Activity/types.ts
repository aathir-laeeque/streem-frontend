import { Error } from '#utils/globalTypes';

import {
  Activity as ActivityTypeType,
  ActivityType,
  Checklist,
  Stage,
  Task,
} from '../checklist.types';

export type Activity = ActivityTypeType & {
  errors: Error[];
};

export type ActivityProps = {
  activity: Activity;
  taskId: Task['id'];
};

export type AddNewActivityArgs = {
  activityType: ActivityType;
  checklistId: Checklist['id'];
  orderTree: Activity['orderTree'];
  stageId: Stage['id'];
  taskId: Task['id'];
};

export type DeleteActivityArgs = {
  activityId: Activity['id'];
  taskId: Task['id'];
  stageId: Stage['id'];
};

export enum ActivityErrors {
  E405 = 'PROVIDE_REASON_FOR_YES_NO_ACTIVITY',
  E406 = 'PROVIDE_REASON_FOR_PARAMETER_ACTIVITY_OFF_LIMITS',
  E407 = 'YES_NO_ACTIVITY_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E408 = 'YES_NO_ACTIVITY_SHOULD_HAVE_EXACTLY_TWO_OPTIONS',
  E409 = 'YES_NO_ACTIVITY_TITLE_CANNOT_BE_EMPTY',
  E410 = 'MULTISELECT_ACTIVITY_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E411 = 'MULTISELECT_ACTIVITY_OPTIONS_CANNOT_BE_EMPTY',
  E412 = 'SINGLE_SELECT_ACTIVITY_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E413 = 'SINGLE_SELECT_ACTIVITY_OPTIONS_CANNOT_BE_EMPTY',
  E414 = 'CHECKLIST_ACTIVITY_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E415 = 'CHECKLIST_ACTIVITY_OPTIONS_CANNOT_BE_EMPTY',
  E416 = 'PARAMETER_ACTIVITY_VALUE_CANNOT_BE_EMPTY',
  E417 = 'PARAMETER_ACTIVITY_VALUE_INVALID',
  E418 = 'PARAMETER_ACTIVITY_OPERATOR_CANNOT_BE_EMPTY',
  E419 = 'MATERIAL_ACTIVITY_NAME_CANNOT_BE_EMPTY',
  E420 = 'MATERIAL_ACTIVITY_LIST_CANNOT_BE_EMPTY',
  E421 = 'MATERIAL_ACTIVITY_CANNOT_BE_MANDATORY',
  E422 = 'INSTRUCTION_ACTIVITY_TEXT_CANNOT_BE_EMPTY',
  E423 = 'INSTRUCTION_ACTIVITY_CANNOT_BE_MANDATORY',
}
