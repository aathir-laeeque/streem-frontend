import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateInteraction } from '../actions';
import { InteractionProps } from '../types';

const InstructionInteraction: FC<InteractionProps> = ({
  interaction,
  index,
}) => {
  const dispatch = useDispatch();

  const update = (data: any) => dispatch(updateInteraction({ ...data }, index));

  return (
    <div className="instruction-interaction">
      <div className="form-field">
        <textarea
          className="form-field-textarea"
          name="instruction"
          value={interaction.data?.text}
          rows={4}
          onChange={(e) => update({ data: { text: e.target.value } })}
        />
      </div>
    </div>
  );
};

export default InstructionInteraction;
