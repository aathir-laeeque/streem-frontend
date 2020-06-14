export enum InteractionType {
  MATERIAL = 'material',
  INSTRUCTION = 'instruction',
  YESNO = 'yes-no',
  CHECKLIST = 'checklist',
  SHOULDBE = 'should-be',
  MEDIA = 'media',
  MULTISELECT = 'multiselect',
}

export interface Interaction {
  id: number;
  type: InteractionType;
  data: any;
}

export interface InteractionsViewProps {
  interactions: Interaction[];
}

export interface InteractionViewProps {
  interaction: Interaction;
}
