import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { updateInteraction } from './actions';
import { InteractionViewProps } from './types';

const InstructionInteraction: FC<InteractionViewProps> = ({
  interaction,
  interactionIndex,
}) => {
  const dispatch = useDispatch();

  // TODO: look into type for data in interaction
  const update = (data: any) =>
    dispatch(
      updateInteraction({ ...data }, interactionIndex, interaction.type),
    );

  return (
    <div className="instruction-interaction">
      <div className="form-field">
        <textarea
          name="instruction"
          value={interaction.data?.text}
          rows={3}
          onChange={(e) => update({ data: { text: e.target.value } })}
        />
      </div>
    </div>
  );
};

export default InstructionInteraction;
