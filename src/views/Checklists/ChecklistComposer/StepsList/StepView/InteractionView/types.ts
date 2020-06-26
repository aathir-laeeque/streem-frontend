import { updateInteraction, executeInteraction } from './actions';

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

export interface Interaction {
  id: number;
  type: InteractionType;
  // TODO: look into type for data in interaction
  data: any;
  mandatory: boolean;
  orderTree: number;
  label?: string;
}

export interface InteractionViewProps {
  interaction: Interaction;
  interactionIndex: number;
}

export enum InteractionActions {
  UPDATE_INTERACTIONS = '@@interaction_view/UPDATE_INTERACTION',
  UPDATE_INTERACTIONS_IN_REDUX = '@@interaction_view/UPDATE_INTERACTIONS_IN_REDUX',
  EXECUTE_INTERACTION = '@@interaction_view/EXECUTE_INTERACTION',
}

export type InteractionActionType = ReturnType<
  typeof updateInteraction | typeof executeInteraction
>;
