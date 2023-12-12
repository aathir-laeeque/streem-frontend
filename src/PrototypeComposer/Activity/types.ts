import { Error } from '#utils/globalTypes';
import { UseFormMethods } from 'react-hook-form';
import {
  Parameter as ParameterTypeType,
  ParameterType,
  Checklist,
  Stage,
  Task,
  TargetEntityType,
} from '../checklist.types';

export type Parameter = ParameterTypeType & {
  errors: Error[];
};

export type ParameterProps = {
  parameter: Parameter;
  taskId: Task['id'];
  isReadOnly: boolean;
  onChangeHandler: (data: Parameter) => void;
  form: UseFormMethods;
  selectedObject?: any;
};

export type AddNewParameterType = {
  type: ParameterType;
  checklistId: Checklist['id'];
  orderTree: Parameter['orderTree'];
  stageId?: Stage['id'];
  taskId?: Task['id'];
  mandatory: boolean;
  label: string;
  description: string;
  data?: any;
  setParameterSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
};

export type DeleteParameterType = {
  parameterId: Parameter['id'];
  taskId?: Task['id'];
  stageId?: Stage['id'];
  targetEntityType?: TargetEntityType;
};

export enum ParameterErrors {
  E405 = 'PROVIDE_REASON_FOR_YES_NO_PARAMETER',
  E406 = 'PROVIDE_REASON_FOR_PARAMETER_PARAMETER_OFF_LIMITS',
  E407 = 'YES_NO_PARAMETER_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E408 = 'YES_NO_PARAMETER_SHOULD_HAVE_EXACTLY_TWO_OPTIONS',
  E409 = 'YES_NO_PARAMETER_TITLE_CANNOT_BE_EMPTY',
  E410 = 'MULTISELECT_PARAMETER_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E411 = 'MULTISELECT_PARAMETER_OPTIONS_CANNOT_BE_EMPTY',
  E412 = 'SINGLE_SELECT_PARAMETER_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E413 = 'SINGLE_SELECT_PARAMETER_OPTIONS_CANNOT_BE_EMPTY',
  E414 = 'CHECKLIST_PARAMETER_OPTIONS_NAME_CANNOT_BE_EMPTY',
  E415 = 'CHECKLIST_PARAMETER_OPTIONS_CANNOT_BE_EMPTY',
  E416 = 'PARAMETER_PARAMETER_VALUE_CANNOT_BE_EMPTY',
  E417 = 'PARAMETER_PARAMETER_VALUE_INVALID',
  E418 = 'PARAMETER_PARAMETER_OPERATOR_CANNOT_BE_EMPTY',
  E419 = 'MATERIAL_PARAMETER_NAME_CANNOT_BE_EMPTY',
  E420 = 'MATERIAL_PARAMETER_LIST_CANNOT_BE_EMPTY',
  E421 = 'MATERIAL_PARAMETER_CANNOT_BE_MANDATORY',
  E422 = 'INSTRUCTION_PARAMETER_TEXT_CANNOT_BE_EMPTY',
  E423 = 'INSTRUCTION_PARAMETER_CANNOT_BE_MANDATORY',
  E430 = 'PARAMETER_PARAMETER_UOM_CANNOT_BE_EMPTY',
  E431 = 'PARAMETER_PARAMETER_NAME_CANNOT_BE_EMPTY',
  E432 = 'PARAMETER_PARAMETER_LOWER_VALUE_CANNOT_BE_MORE_THAN_UPPER_VALUE',
  E433 = 'CALCULATION_PARAMETER_CANNOT_BE_EMPTY',
  E434 = 'CALCULATION_PARAMETER_INVALID_EXPRESSION',
  E435 = 'CALCULATION_PARAMETER_UNIT_OF_MEASUREMENT_CANNOT_BE_EMPTY',
  E436 = 'SOME_PARAMETER_VALUES_NOT_SET_TO_PERFORM_CALCULATION',
  E437 = 'SOME_OF_THE_PARAMETERS_REQUIRED_TO_PERFORM_CALCULATION_DO_NOT_EXIST',
  E439 = 'PARAMETER_LABEL_CANNOT_BE_EMPTY',
}
