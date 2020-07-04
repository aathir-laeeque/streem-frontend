import { updateInteraction } from './actions';

export enum InteractionType {
  MATERIAL = 'material',
  INSTRUCTION = 'instruction',
  YESNO = 'yes-no',
  CHECKLIST = 'checklist',
  SHOULDBE = 'should-be',
  MEDIA = 'media',
  MULTISELECT = 'multiselect',
  TEXTBOX = 'textbox',
  SIGNATURE = 'signature',
}

export interface ChecklistInteractionData {
  name: string;
  value: number;
}

export interface Interaction {
  id: number;
  type: InteractionType;
  // TODO: look into type for data in interaction
  data: any;
  mandatory: boolean;
  orderTree: number;
  label?: string;
}

export interface InteractionsListProps {
  interactions: Interaction[];
}

export interface InteractionProps {
  interaction: Interaction;
  index: number;
}

export enum InteractionAction {
  UPDATE_INTERACTION = '@@checklist/composer/interaction/UPDATE_INTERACTION',
  UPDATE_INTERACTION_REDUX = '@@checklist/composer/interaction/UPDATE_INTERACTION_REDUX',
}

export type InteractionActionType = ReturnType<typeof updateInteraction>;
