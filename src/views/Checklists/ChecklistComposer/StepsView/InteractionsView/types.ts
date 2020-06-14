export interface Interaction {
  id: number;
  type: string;
  data: any[];
}

export interface InteractionsViewProps {
  interactions: Interaction[];
}

export interface InteractionViewProps {
  interaction: Interaction;
}
