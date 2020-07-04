import { actionSpreader } from '#store';

import { Interaction, InteractionAction } from './types';

export const updateInteraction = (data: Partial<Interaction>, index: number) =>
  actionSpreader(InteractionAction.UPDATE_INTERACTION, { data, index });

export const updateInteractionInRedux = (data: Interaction, index: number) =>
  actionSpreader(InteractionAction.UPDATE_INTERACTION_REDUX, { data, index });
