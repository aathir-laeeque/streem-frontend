import React, { FC } from 'react';

import { Interaction } from './types';

interface InstructionInteractionProps {
  interaction: Interaction;
}

const InstructionInteraction: FC<InstructionInteractionProps> = ({
  interaction,
}) => (
  <div className="step-interaction-container">
    <div className="instruction-interaction">
      <textarea
        name="instruction"
        value={interaction.data.map((el) => el.name).join('. ')}
        rows={3}
        onChange={undefined}
      />
    </div>
  </div>
);

export default InstructionInteraction;
