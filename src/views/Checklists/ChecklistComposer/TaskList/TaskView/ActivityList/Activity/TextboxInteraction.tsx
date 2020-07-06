import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { InteractionProps } from '../types';
import { updateInteraction } from '../actions';

const TextboxInteraction: FC<InteractionProps> = ({ interaction, index }) => {
  const dispatch = useDispatch();

  // TODO: look into type of data in interaction
  const update = (data: any) => dispatch(updateInteraction({ ...data }, index));

  return (
    <div className="textbox-interaction">
      <div className="form-field">
        <label className="form-field-label">{interaction.label}</label>
        <textarea
          className="form-field-textarea"
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
