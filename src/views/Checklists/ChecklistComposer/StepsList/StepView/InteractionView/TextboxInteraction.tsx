import { useTypedSelector } from '#store';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { ChecklistState } from '../../../types';
import { updateInteraction } from './actions';
import { InteractionViewProps } from './types';

const TextboxInteraction: FC<InteractionViewProps> = ({
  interaction,
  interactionIndex,
}) => {
  const dispatch = useDispatch();

  const { checklistState } = useTypedSelector(
    (state) => state.checklistComposer,
  );

  const isCreatingChecklist = checklistState === ChecklistState.ADD_EDIT;

  // TODO: look into type of data in interaction
  const update = (data: any) =>
    dispatch(
      updateInteraction({ ...data }, interactionIndex, interaction.type),
    );

  return (
    <div className="textbox-interaction">
      <div className="form-field">
        <label className="form-input-label">Label</label>
        <textarea
          className="form-input form-input-value"
          rows={4}
          value={interaction?.data?.text}
          placeholder="Enter your remarks"
          onChange={(e) => update({ data: { text: e.target.value } })}
          {...(isCreatingChecklist && { disabled: true })}
        />
      </div>
    </div>
  );
};

export default TextboxInteraction;
