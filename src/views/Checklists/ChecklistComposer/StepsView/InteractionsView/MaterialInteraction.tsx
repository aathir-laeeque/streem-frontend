import React, { FC } from 'react';

import { InteractionViewProps } from './types';

const MaterialInteraction: FC<InteractionViewProps> = ({ interaction }) => (
  <div className="step-interaction-container">
    <ol className="material-interaction">
      {interaction.data.map((el, index) => (
        <li key={index} className="material-interaction-item">
          <img
            src={`http://api.streem.leucinetech.com${el.image}`}
            className="material-interaction-item-image"
          />
          <span>{el.name}</span>
          <div className="material-interaction-item-controls">
            <span className="control-button">-</span>
            <span className="quantity">{el.quantity}</span>
            <span className="control-button">+</span>
          </div>
        </li>
      ))}
      <div className="material-interaction-add-new">+ Add new Item</div>
    </ol>
  </div>
);

export default MaterialInteraction;
