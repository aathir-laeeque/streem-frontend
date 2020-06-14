import React, { FC } from 'react';

import { InteractionViewProps } from './types';

const ChecklistInteraction: FC<InteractionViewProps> = ({ interaction }) => (
  <div className="step-interaction-container">
    <div className="checklist-interaction">
      <div className="form-field">
        <input
          className="form-input form-input-value"
          type="text"
          onChange={undefined}
          placeholder="Enter a title for the checklist"
        />
      </div>

      <div className="checklist-container">
        {interaction.data.map((el, index) => (
          <div className="list-item" key={index}>
            <input type="checkbox" className="checkbox" />
            <span className="list-item-value">{el.name}</span>
            <span className="remove-button">x</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ChecklistInteraction;
