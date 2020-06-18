import React, { FC } from 'react';

import { InteractionViewProps } from './types';

const TextboxInteraction: FC<InteractionViewProps> = ({ interaction }) => (
  <div className="step-interaction-container">
    <div className="textbox-interaction">
      <div className="form-field">
        <label className="form-input-label">Label</label>
        <textarea
          className="form-input form-input-value"
          rows={4}
          value={interaction?.data?.text}
          placeholder="Enter your remarks"
          onChange={undefined}
        />
      </div>
    </div>
  </div>
);

export default TextboxInteraction;
