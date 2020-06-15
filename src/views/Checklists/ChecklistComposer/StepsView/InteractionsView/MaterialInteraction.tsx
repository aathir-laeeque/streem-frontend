import React, { FC } from 'react';
import { Add, Remove } from '@material-ui/icons';

import { InteractionViewProps } from './types';

const MaterialInteraction: FC<InteractionViewProps> = ({ interaction }) => (
  <div className="step-interaction-container">
    <ol className="material-interaction">
      {interaction.data.map((el, index) => (
        <li key={index} className="material-interaction-item">
          <img src={el.link} className="material-interaction-item-image" />
          <span>{el.name}</span>
          <div className="material-interaction-item-controls">
            <Remove className="icon" />
            <span className="quantity">{el.quantity || 1}</span>
            <Add className="icon" />
          </div>
        </li>
      ))}
      <div className="material-interaction-add-new">
        <Add className="icon" />
        <span>Add new Item</span>
      </div>
    </ol>
  </div>
);

export default MaterialInteraction;
