import { MandatoryActivity, NonMandatoryActivity } from './checklist.types';

export const ActivityOptions = [
  { label: 'Checklist', value: MandatoryActivity.CHECKLIST },
  { label: 'Instruction', value: NonMandatoryActivity.INSTRUCTION },
  { label: 'Material', value: NonMandatoryActivity.MATERIAL },
  { label: 'Media', value: MandatoryActivity.MEDIA },
  { label: 'Multi-select', value: MandatoryActivity.MULTISELECT },
  { label: 'Parameter', value: MandatoryActivity.SHOULD_BE },
  { label: 'Signature', value: MandatoryActivity.SIGNATURE },
  { label: 'Textbox', value: MandatoryActivity.TEXTBOX },
  { label: 'Yes No', value: MandatoryActivity.YES_NO },
];
