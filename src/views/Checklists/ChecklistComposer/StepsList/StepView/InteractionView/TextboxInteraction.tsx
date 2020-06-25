import React, { FC } from 'react';

import { InteractionViewProps } from './types';
import { useDispatch } from 'react-redux';
import { updateInteraction } from './actions';

const TextboxInteraction: FC<InteractionViewProps> = ({
  interaction,
  interactionIndex,
}) => {
  const dispatch = useDispatch();

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
        />
      </div>
    </div>
  );
};

export default TextboxInteraction;
