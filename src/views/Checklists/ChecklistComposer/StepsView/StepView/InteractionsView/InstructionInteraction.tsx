import React, { FC } from 'react';

import { InteractionViewProps } from './types';

const InstructionInteraction: FC<InteractionViewProps> = ({ interaction }) => (
  <div className="step-interaction-container">
    <div className="instruction-interaction">
      <div className="form-field">
        <textarea
          name="instruction"
          value={interaction.data?.text}
          rows={3}
          onChange={undefined}
          readOnly
          defaultValue={interaction.data?.text}
        />
      </div>
    </div>
  </div>
);

export default InstructionInteraction;
