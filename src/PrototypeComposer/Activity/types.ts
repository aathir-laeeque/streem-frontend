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

export type AddNewActivityType = {
  activityType: ActivityType;
  checklistId: Checklist['id'];
  orderTree: Activity['orderTree'];
  stageId: Stage['id'];
  taskId: Task['id'];
};

export type DeleteActivityType = {
  activityId: Activity['id'];
  taskId: Task['id'];
  stageId: Stage['id'];
};

export enum ChecklistActivityErrors {
  E414 = 'CHECKLIST_ACTIVITY_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E415 = 'CHECKLIST_ACTIVITY_OPTIONS_CANNOT_BE_EMPTY',
}

export enum MaterialActivityErrors {
  E419 = 'MATERIAL_ACTIVITY_NAME_CANNOT_BE_EMPTY',
  E420 = 'MATERIAL_ACTIVITY_LIST_CANNOT_BE_EMPTY',
  // E421 cannot happen coz required toggle switch is not rendered for material activity
  E421 = 'MATERIAL_ACTIVITY_CANNOT_BE_MANDATORY',
}

// This enum contains error for both single and multi select as both are rendered from same component
export enum SelectActivityErrors {
  E410 = 'MULTISELECT_ACTIVITY_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E411 = 'MULTISELECT_ACTIVITY_OPTIONS_CANNOT_BE_EMPTY',
  E412 = 'SINGLE_SELECT_ACTIVITY_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E413 = 'SINGLE_SELECT_ACTIVITY_OPTIONS_CANNOT_BE_EMPTY',
}

export enum ParameterActivityErrors {
  E417 = 'PARAMETER_ACTIVITY_VALUE_INVALID',
  E418 = 'PARAMETER_ACTIVITY_OPERATOR_CANNOT_BE_EMPTY',
  E430 = 'PARAMETER_ACTIVITY_UOM_CANNOT_BE_EMPTY',
  E431 = 'PARAMETER_ACTIVITY_NAME_CANNOT_BE_EMPTY',
}

export enum YesNoActivityErrors {
  E407 = 'YES_NO_ACTIVITY_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E408 = 'YES_NO_ACTIVITY_SHOULD_HAVE_EXACTLY_TWO_OPTIONS',
  E409 = 'YES_NO_ACTIVITY_TITLE_CANNOT_BE_EMPTY',
}

// Add any new activity error codes to this enum as well as the respective activity error code enum mappings too.
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
  E430 = 'PARAMETER_ACTIVITY_UOM_CANNOT_BE_EMPTY',
  E431 = 'PARAMETER_ACTIVITY_NAME_CANNOT_BE_EMPTY',
}
