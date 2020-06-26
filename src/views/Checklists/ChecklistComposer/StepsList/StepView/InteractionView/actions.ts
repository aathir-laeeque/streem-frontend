import { actionSpreader } from '#store';

import { Interaction, InteractionActions, InteractionType } from './types';

export const updateInteraction = (
  interaction: Partial<Interaction>,
  interactionIndex: number,
  interactionType: InteractionType,
) =>
  actionSpreader(InteractionActions.UPDATE_INTERACTIONS, {
    interaction,
    interactionIndex,
    interactionType,
  });

export const udpateInteractionInRedux = (
  interaction: Partial<Interaction>,
  interactionIndex: number,
) =>
  actionSpreader(InteractionActions.UPDATE_INTERACTIONS_IN_REDUX, {
    interaction,
    interactionIndex,
  });

export const executeInteraction = (
  interaction: Partial<Interaction>,
  interactionData: any,
) =>
  actionSpreader(InteractionActions.EXECUTE_INTERACTION, {
    interaction,
    interactionData,
  });
