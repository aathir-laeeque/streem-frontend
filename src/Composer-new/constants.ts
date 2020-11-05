import { MandatoryActivity, NonMandatoryActivity } from './checklist.types';

export const ActivityOptions = [
  { label: 'Checklist', value: MandatoryActivity.CHECKLIST },
  { label: 'Instruction', value: NonMandatoryActivity.INSTRUCTION },
  { label: 'Material', value: NonMandatoryActivity.MATERIAL },
  { label: 'Media', value: MandatoryActivity.MEDIA },
  { label: 'Multi-select', value: MandatoryActivity.MULTISELECT },
  { label: 'Parameter', value: MandatoryActivity.PARAMETER },
  { label: 'Signature', value: MandatoryActivity.SIGNATURE },
  { label: 'Single-select', value: MandatoryActivity.SINGLE_SELECT },
  { label: 'Comments', value: MandatoryActivity.TEXTBOX },
  { label: 'Yes/No', value: MandatoryActivity.YES_NO },
];

export const PARAMETER_OPERATORS = [
  { label: '( = ) Equal to', value: 'EQUAL_TO' },
  { label: '( < ) Less than', value: 'LESS_THAN' },
  { label: '( <= ) Less than equal to', value: 'LESS_THAN_EQUAL_TO' },
  { label: '( > ) More than', value: 'MORE_THAN' },
  { label: '( >= ) More than equal to', value: 'MORE_THAN_EQUAL_TO' },
  { label: '( <-> ) Between', value: 'BETWEEN' },
];
