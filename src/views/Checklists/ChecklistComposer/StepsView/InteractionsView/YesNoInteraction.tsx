import React, { FC } from 'react';
import { Interaction } from './types';

interface YesNoInteractionProps {
  interaction: Interaction;
}

const YesNoInteraction: FC<YesNoInteractionProps> = ({ interaction }) => (
  <div className="step-interaction-container">
    <div className="yes-no-interaction">
      <div className="form-field">
        <label className="form-input-label">Label</label>
        <input
          className="form-input form-input-value"
          type="text"
          value=""
          onChange={undefined}
        />
      </div>
      <div className="buttons-container">
        {interaction.data.map((el, index) => (
          <div key={index} className="button-item">
            <div className="form-field">
              <label className="form-input-label">
                {el.type === 'yes' ? 'Positive' : 'Negative'} Button Label
              </label>
              <input
                className="form-input form-input-value"
                type="text"
                value={el.name}
                onChange={undefined}
              />
            </div>
            <button className={`${el.type}-button`}>{el.name}</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default YesNoInteraction;
